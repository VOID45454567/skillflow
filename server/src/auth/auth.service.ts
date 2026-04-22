import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as brcypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import e, { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import crypto from 'crypto'
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { Roles } from '../../prisma/generated/prisma';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly users: UsersService,
        private readonly configService: ConfigService,
        private readonly jwt: JwtService,
        private readonly mail: MailerService
    ) { }

    async register(dto: RegisterDto, res: Response) {
        const existingUser = await this.users.findByEmail(dto.email)

        if (existingUser) {
            throw new ConflictException({ message: "пользователь с такой почтой уже есть" })
        }

        const salt = this.configService.getOrThrow<string>('BCRYPT_SALT_ROUNDS')

        const hashedPassword = await brcypt.hash(dto.password, Number(salt))

        const newUser = await this.prisma.user.create({ data: { ...dto, password: hashedPassword } })

        const { accessToken, refreshToken } = await this.generateTokensPair(newUser.id, newUser.role, newUser.email)

        this.setCookies(res, refreshToken, accessToken)

        return newUser
    }

    async login(dto: LoginDto, res: Response) {
        const existingUser = await this.users.findByEmail(dto.email)
        if (!existingUser) {
            throw new BadRequestException({ message: 'Пользователь не найден' })
        }

        const isPasswordMatch = await brcypt.compare(dto.password, existingUser.password)

        if (!isPasswordMatch) {
            throw new BadRequestException({ message: 'Неверные данные' })
        }

        if (existingUser.enabledTwoFactor) {
            return { requiresTwoFactor: true, userId: existingUser.id }
        }

        const { accessToken, refreshToken } = await this.generateTokensPair(
            existingUser.id,
            existingUser.role,
            existingUser.email
        )

        this.setCookies(res, refreshToken, accessToken)

        return this.users.findById(existingUser.id)
    }

    async verify2fa(code: string, userId: number, res: Response) {
        const dbCode = await this.prisma.twoVerificationCode.findFirst({
            where: {
                userId,
                isUsed: false,
            }
        })

        if (!dbCode) {
            return {
                success: false,
                message: 'Нет активных кодов'
            }
        }

        const user = await this.users.findById(userId)



        if (dbCode.code !== code) {
            return {
                success: false,
                message: 'Неверный код, попробуйте еще раз'
            }
        }

        await this.prisma.twoVerificationCode.update({
            where: { id: dbCode.id },
            data: { isUsed: true }
        })

        const { accessToken, refreshToken } = await this.generateTokensPair(
            userId,
            user!.role!,
            user!.email!
        )

        this.setCookies(res, refreshToken, accessToken)
        const userCodes = await this.prisma.twoVerificationCode.findMany({ where: { userId: userId } })

        if (userCodes.length < 2) {
            console.log('Мало кодов');
            await this.regenerate2faCodes(userId)
        }

        return {
            success: true,
            message: '2FA подтвержден',
            user
        }
    }

    async logout(res: Response) {
        res.clearCookie('accessToken')
        res.clearCookie('refreshToken')
    }

    async sendVerificationCode(id: number) {
        const user = await this.users.findById(id)

        if (!user) {
            throw new BadRequestException('Пользователь с таким id не существует')
        }

        const code = await this.prisma.twoVerificationCode.findFirst({ where: { userId: id, isUsed: false } })

        if (!code) {
            throw new NotFoundException('кода нет')
        }
        try {
            await this.mail.sendMail({
                to: user.email,
                subject: 'Требуется подтверждение входа',
                text: `Здравствуйте ${user.login}, код для входа - ${code.code}`
            })
        } catch (error) {
            console.log('Ошибка в отправке письма');

        }
    }

    async getMe(req: Request) {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw new UnauthorizedException({ message: "Токена нет" })
        }

        try {
            const tokenPayload = this.jwt.verify(accessToken)
            return await this.users.findById(tokenPayload.id)
        } catch (error) {
            throw new UnauthorizedException({ message: "Неверный токен" })
        }
    }

    private async generateTokensPair(id: number, role: Roles, email: string) {
        const accessToken = this.jwt.sign(
            { id, role, email },
            { expiresIn: this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES') }
        );

        const existingRefreshToken = await this.prisma.refreshToken.findFirst({ where: { userId: id } })

        if (!existingRefreshToken) {
            const newRefreshToken = this.jwt.sign({ id, role, email }, { expiresIn: '7d' })
            const token = await this.prisma.refreshToken.create({ data: { userId: id, tokenValue: newRefreshToken } })

            return { accessToken, refreshToken: token.tokenValue }
        }


        return { accessToken, refreshToken: existingRefreshToken.tokenValue };
    }

    private setCookies(res: Response, refreshToken: string, accessToken: string) {
        const isProduction = this.configService.get('NODE_ENV') === 'production'
        const accessTokenMaxAge = this.getMaxAgeFromExpires(this.configService.getOrThrow<string>('JWT_EXPIRES'))
        const refreshTokenMaxAge = this.getMaxAgeFromExpires(this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES'))

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: accessTokenMaxAge
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: refreshTokenMaxAge
        })
    }

    private getMaxAgeFromExpires(expiresIn: string): number {
        const units: { [key: string]: number } = {
            's': 1,
            'm': 60,
            'h': 3600,
            'd': 86400,
            'w': 604800
        }

        const match = expiresIn.match(/^(\d+)([smhdw])$/)
        if (!match) {
            return 10 * 60 * 1000
        }

        const value = parseInt(match[1])
        const unit = match[2]

        return value * units[unit] * 1000
    }

    async enable2fa(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { enabledTwoFactor: true }
        })

        const codesCount = this.configService.getOrThrow<number>('TWO_FACTOR_CODES_COUNT')
        const codes = this.generateTwofactorCodes(codesCount)
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 10)

        codes.forEach(async (code) => {
            await this.prisma.twoVerificationCode.create({
                data: {
                    code: code,
                    userId: userId,
                }
            })
        })

        return { codes }
    }

    async disable2fa(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { enabledTwoFactor: false }
        })

        await this.prisma.twoVerificationCode.deleteMany({ where: { userId } })
    }

    async regenerate2faCodes(userId: number) {
        await this.prisma.twoVerificationCode.deleteMany({
            where: { userId },
        })

        const codesCount = this.configService.getOrThrow<number>('TWO_FACTOR_CODES_COUNT')
        const codes = this.generateTwofactorCodes(codesCount)
        const expiresAt = new Date()
        expiresAt.setMinutes(expiresAt.getMinutes() + 10)

        await this.prisma.twoVerificationCode.createMany({
            data: codes.map(code => ({
                userId,
                code,
                isUsed: false,
                expiresAt,
            })),
        })

        return codes
    }

    async get2faStatus(userId: number) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { enabledTwoFactor: true },
        })

        const activeCodesCount = await this.prisma.twoVerificationCode.count({
            where: {
                userId,
                isUsed: false,
            },
        })

        return {
            enabled: user?.enabledTwoFactor || false,
            activeCodesCount,
            totalCodes: user?.enabledTwoFactor ?
                await this.prisma.twoVerificationCode.count({ where: { userId } }) : 0,
        }
    }

    async refreshTokens(refreshToken: string, res: Response) {
        console.log(refreshToken);

        const storedToken = await this.prisma.refreshToken.findFirst({
            where: { tokenValue: refreshToken },
        })

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token')
        }

        try {
            const payload = this.jwt.verify(refreshToken)

            const { accessToken, refreshToken: newRefreshToken } =
                await this.generateTokensPair(
                    payload.id,
                    payload.role,
                    payload.email,
                )

            await this.prisma.refreshToken.update({ where: { id: storedToken.id }, data: { tokenValue: newRefreshToken } })


            this.setCookies(res, newRefreshToken, accessToken)

            return { success: true }
        } catch (error) {
            throw new UnauthorizedException('Refresh token expired')
        }
    }

    private generateTwofactorCodes(count: number) {
        return Array.from({ length: count }, () => crypto.randomInt(100000, 1000000).toString().padStart(6, '0'))
    }


    async sendAccountToVerification(id: number) {
        return await this.users.sendAccountToVerification(id)
    }
}