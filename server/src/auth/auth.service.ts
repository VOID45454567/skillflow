import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import type { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { randomBytes } from 'crypto';
import { User } from 'src/generated/prisma/client';

@Injectable()
export class AuthService {
    constructor(
        readonly prisma: PrismaService,
        readonly users: UsersService,
        readonly jwtService: JwtService
    ) { }
    async register(dto: RegisterDto, res: Response) {
        const existingUser = await this.users.findByEmail(dto.email)
        if (existingUser) {
            throw new ConflictException('Такой пользователь уже есть')
        }
        const hashedPass = await bcrypt.hash(dto.password, 10)
        const newUser = await this.users.create({ ...dto, password: hashedPass })
        const tokens = await this.createTokensPair(newUser)
        this.setCookie(res, tokens.refreshToken, tokens.accessToken)
    }

    @Cron('0 0 * * *')
    async cleanupRevokedTokens() {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const result = await this.prisma.refreshToken.deleteMany({
            where: {
                isRevoked: true,
                createdAt: { lt: thirtyDaysAgo }
            }
        });

        console.log(`Очищено ${result.count} старых отозванных токенов`);
    }

    async verifyTwoFactorCode(userId: number, code: string) {
        const user = await this.users.findById(userId)
        if (!user) {
            throw new NotFoundException('Не найденн')
        }
        const backupCode = await this.prisma.twoFactorBackupCode.findFirst({
            where: {
                userId,
                code: code,
                isUsed: false
            }
        });

        if (!backupCode) {
            return false;
        }

        await this.prisma.twoFactorBackupCode.update({
            where: { id: backupCode.id },
            data: { isUsed: true }
        });

        return true;
    }

    async enableTwoFactorVerification(userId: number) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        await this.prisma.twoFactorBackupCode.deleteMany({
            where: { userId }
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false }
        });

        return {
            message: '2FA успешно отключен'
        };
    }

    async disableTwoFactor(userId: number) {
        const user = await this.users.findById(userId);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        await this.prisma.twoFactorBackupCode.deleteMany({
            where: { userId }
        });

        await this.prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: false }
        });

        return {
            message: '2FA успешно отключен'
        };
    }

    async login(dto: LoginDto, res: Response) {
        const existingUser = await this.users.findByEmail(dto.email)

        if (!existingUser) {
            throw new NotFoundException('Такого пользователя нету')
        }

        const isMatch = await this.checkPassword(dto.password, existingUser)
        if (!isMatch) {
            throw new UnauthorizedException('Неверный логин или пароль')
        }

        if (existingUser.twoFactorEnabled) {
            const tempToken = this.jwtService.sign(
                {
                    sub: existingUser.id,
                    type: '2fa_pending',
                    email: existingUser.email
                },
                { expiresIn: '5m' }
            );

            res.cookie('temp_token', tempToken, {
                httpOnly: true,
                secure: false,
                maxAge: 5 * 60 * 1000,
            });

            return {
                requiresTwoFactor: true,
                message: 'Требуется подтверждение 2FA',
                tempToken: tempToken
            };
        }

        const tokens = await this.createTokensPair(existingUser);
        this.setCookie(res, tokens.refreshToken, tokens.accessToken);
    }

    private async checkPassword(plainTextPass: string, user: User) {
        return await bcrypt.compare(plainTextPass, user.password)
    }

    async setTwoFactorBackupCode(id: number) {
        const user = await this.users.findById(id)
        if (!user) {
            throw new NotFoundException('Такого пользователя нету')
        }

        const backupCodes = Array.from({ length: 4 }, () => ({
            code: randomBytes(6).toString('hex').toUpperCase(),
            userId: id
        }));

        await this.prisma.twoFactorBackupCode.deleteMany({
            where: { userId: id }
        });

        await this.prisma.twoFactorBackupCode.createMany({
            data: backupCodes
        });

        await this.prisma.user.update({
            where: { id },
            data: { twoFactorEnabled: true }
        });

    }

    async getMe(req: Request) {
        const accessToken = req.cookies['access_token'];
        try {
            const payload = this.jwtService.verify(accessToken);
            const user = await this.users.findById(payload.sub);

            if (!user) {
                throw new UnauthorizedException('Пользователь не найден');
            }

            const { password, ...userData } = user;
            return userData;
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Токен истек');
            }
            throw new UnauthorizedException('Недействительный токен');
        }
    }

    async logout(userId: number, res: Response) {
        await this.revokeAllUserTokens(userId)
        this.clearCookie(res)
    }

    async refreshTokens(refreshTokenValue: string, res: Response, req: Request) {
        const refreshToken = await this.prisma.refreshToken.findFirst({
            where: {
                tokenValue: refreshTokenValue,
                isRevoked: false
            },
            include: { user: true }
        });

        if (!refreshToken) {
            throw new UnauthorizedException('Недействительный refresh токен');
        }

        if (refreshToken.expiriesAt < new Date()) {
            await this.revokeRefreshToken(refreshToken.id);
            throw new UnauthorizedException('Refresh токен истек');
        }

        await this.revokeRefreshToken(refreshToken.id);

        const tokens = await this.createTokensPair(refreshToken.user);
        this.setCookie(res, tokens.refreshToken, tokens.accessToken);

        return { message: 'Токены обновлены' };
    }

    async revokeRefreshToken(tokenId: number) {
        return this.prisma.refreshToken.update({
            where: { id: tokenId }, data: {
                isRevoked: true
            }
        })
    }
    async revokeAllUserTokens(userId: number) {
        return this.prisma.refreshToken.updateMany({
            where: {
                userId,
                isRevoked: false
            },
            data: {
                isRevoked: true
            }
        });
    }
    private setCookie(res: Response, refreshToken: string, accessToken: string) {
        res.cookie('access_token', accessToken, {
            expires: new Date(Date.now() + 1000 * 60 * 30),
            httpOnly: true,
            secure: false,
        })
        res.cookie('refresh_token', refreshToken, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            httpOnly: true,
            secure: false,
        })

    }

    private clearCookie(res: Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: false,
        })
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
        })
    }

    private async createTokensPair(user: User) {
        const accessToken = this.jwtService.sign({ sub: user.id, email: user.email, role: user.role })
        const refreshToken = await this.generateRefreshToken()
        await this.createRefreshToken(user, refreshToken)
        return {
            accessToken,
            refreshToken
        }
    }

    private async createRefreshToken(user: User, refreshToken: string) {
        const existingToken = await this.prisma.refreshToken.findUnique({ where: { userId: user.id } })
        if (!existingToken) {
            throw new NotFoundException('Токен не найден')
        }
        await this.prisma.refreshToken.delete({ where: { id: existingToken.id } })
        await this.prisma.refreshToken.create({
            data: {
                expiriesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                tokenValue: refreshToken,
                userId: user.id,
            }
        })
    }

    private async generateRefreshToken() {
        return randomBytes(30).toString('hex')
    }
}
