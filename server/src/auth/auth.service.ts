import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
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
        const hashedPassword = await bcrypt.hash(dto.password, Number(salt))
        const newUser = await this.prisma.user.create({
            data: { ...dto, password: hashedPassword }
        })

        const { accessToken, refreshToken } = await this.generateTokensPair(
            newUser.id,
            newUser.role,
            newUser.email
        )

        this.setCookies(res, refreshToken, accessToken)

        return await this.users.findById(newUser.id)
    }

    async login(dto: LoginDto, res: Response) {
        const existingUser = await this.users.findByEmail(dto.email)
        if (!existingUser) {
            throw new BadRequestException({ message: 'Пользователь не найден' })
        }

        const isPasswordMatch = await bcrypt.compare(dto.password, existingUser.password)
        if (!isPasswordMatch) {
            throw new BadRequestException({ message: 'Неверные данные' })
        }

        if (existingUser.enabledTwoFactor) {
            await this.sendVerificationCode(existingUser.id)
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

        const userCodes = await this.prisma.twoVerificationCode.count({
            where: { userId: userId, isUsed: false }
        })

        if (userCodes < 2) {
            console.log('Мало кодов, регенерируем...');
            await this.regenerate2faCodes(userId)
        }

        return {
            success: true,
            message: '2FA подтвержден',
            user
        }
    }

    async logout(res: Response, refreshToken?: string) {
        if (refreshToken) {
            try {
                await this.prisma.refreshToken.deleteMany({
                    where: { tokenValue: refreshToken }
                });
            } catch (error) {
                console.error('Ошибка при удалении refresh токена:', error);
            }
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            sameSite: 'strict',
        });

        return { success: true, message: 'Вы успешно вышли из системы' };
    }

    async sendVerificationCode(id: number) {
        const user = await this.users.findById(id)

        if (!user) {
            throw new BadRequestException('Пользователь с таким id не существует')
        }

        const code = await this.prisma.twoVerificationCode.findFirst({
            where: {
                userId: id,
                isUsed: false,
                expiresAt: { gt: new Date() }
            }
        })

        if (!code) {
            throw new NotFoundException('Нет доступных кодов верификации')
        }

        try {
            await this.mail.sendMail({
                to: user.email,
                subject: 'Требуется подтверждение входа',
                text: `Здравствуйте ${user.login}, код для входа - ${code.code}`
            })
            console.log('Письмо отправлено на email ' + user.email);
        } catch (error) {
            console.error('Ошибка в отправке письма:', error);
            throw new BadRequestException('Не удалось отправить код подтверждения');
        }
    }

    async getMe(req: Request) {
        const accessToken = req.cookies.accessToken
        if (!accessToken) {
            throw new UnauthorizedException({ message: "Токен доступа отсутствует" })
        }

        try {
            const tokenPayload = this.jwt.verify(accessToken)
            return await this.users.findById(tokenPayload.id)
        } catch (error) {
            throw new UnauthorizedException({ message: "Неверный или истекший токен доступа" })
        }
    }

    private async generateTokensPair(id: number, role: Roles, email: string) {
        // Проверяем, какой секрет реально используется
        const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
        const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');

        console.log('=== GENERATE TOKENS PAIR ===');
        console.log('Access secret from config:', accessSecret);
        console.log('Refresh secret from config:', refreshSecret);

        const accessToken = this.jwt.sign(
            { id, role, email, type: 'access' },
            {
                expiresIn: '7d',
                secret: accessSecret
            }
        );

        const refreshToken = this.jwt.sign(
            { id, role, email, type: 'refresh' },
            {
                expiresIn: '7d',
                secret: refreshSecret
            }
        );

        const decodedAccess = this.jwt.decode(accessToken);
        const decodedRefresh = this.jwt.decode(refreshToken);

        console.log('Decoded access token:', JSON.stringify(decodedAccess, null, 2));
        console.log('Decoded refresh token:', JSON.stringify(decodedRefresh, null, 2));

        try {
            this.jwt.verify(accessToken, { secret: accessSecret });
            console.log('✅ Access token verified with ACCESS secret');
        } catch (e) {
            console.log('❌ Access token FAILED with ACCESS secret');
        }

        try {
            this.jwt.verify(accessToken, { secret: refreshSecret });
            console.log('✅ Access token verified with REFRESH secret');
        } catch (e) {
            console.log('❌ Access token FAILED with REFRESH secret');
        }

        try {
            this.jwt.verify(refreshToken, { secret: refreshSecret });
            console.log('✅ Refresh token verified with REFRESH secret');
        } catch (e) {
            console.log('❌ Refresh token FAILED with REFRESH secret');
        }

        try {
            this.jwt.verify(refreshToken, { secret: accessSecret });
            console.log('✅ Refresh token verified with ACCESS secret');
        } catch (e) {
            console.log('❌ Refresh token FAILED with ACCESS secret');
        }

        console.log('=== END GENERATE ===');

        await this.prisma.refreshToken.deleteMany({
            where: { userId: id }
        });

        await this.prisma.refreshToken.create({
            data: {
                userId: id,
                tokenValue: refreshToken,
                expiresAt: new Date(Date.now() + this.getMaxAgeFromExpires(
                    this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES')
                )),
            }
        });

        return { accessToken, refreshToken };
    }

    private setCookies(res: Response, refreshToken: string, accessToken: string) {
        const isProduction = this.configService.get('NODE_ENV') === 'production'
        const accessTokenMaxAge = this.getMaxAgeFromExpires(
            this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRES')
        )
        const refreshTokenMaxAge = this.getMaxAgeFromExpires(
            this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES')
        )

        // ВАЖНО: Сначала очищаем старые куки
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            path: '/'
        });

        // Затем устанавливаем новые
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: accessTokenMaxAge,
            path: '/'
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'strict',
            maxAge: refreshTokenMaxAge,
            path: '/'
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

        const codesCount = Number(this.configService.getOrThrow<number>('TWO_FACTOR_CODES_COUNT'))
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

        return { codes }
    }

    async disable2fa(userId: number) {
        await this.prisma.user.update({
            where: { id: userId },
            data: { enabledTwoFactor: false }
        })

        await this.prisma.twoVerificationCode.deleteMany({ where: { userId } })
        return { success: true, message: '2FA отключен' }
    }

    async regenerate2faCodes(userId: number) {
        await this.prisma.twoVerificationCode.deleteMany({
            where: { userId },
        })

        const codesCount = Number(this.configService.getOrThrow<number>('TWO_FACTOR_CODES_COUNT'))
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

        return { codes }
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
                expiresAt: { gt: new Date() }
            },
        })

        return {
            enabled: user?.enabledTwoFactor || false,
            activeCodesCount,
            totalCodes: user?.enabledTwoFactor ?
                await this.prisma.twoVerificationCode.count({ where: { userId } }) : 0,
        }
    }

    async refreshTokens(oldRefreshToken: string, res: Response) {
        console.log('=== REFRESH TOKENS START ===');
        console.log('1. Old token (first 100 chars):', oldRefreshToken?.substring(0, 100));

        if (!oldRefreshToken) {
            console.log('❌ No refresh token provided');
            throw new UnauthorizedException('Refresh токен отсутствует');
        }

        // Декодируем без верификации
        const decoded = this.jwt.decode(oldRefreshToken);
        console.log('2. Decoded token:', JSON.stringify(decoded, null, 2));

        // Проверяем срок действия из декодированного токена
        if (decoded && decoded.exp) {
            const expDate = new Date(decoded.exp * 1000);
            const now = new Date();
            console.log('3. Token expiration:', expDate);
            console.log('4. Current time:', now);
            console.log('5. Is expired?:', expDate < now);
        }

        // Ищем токен в БД
        console.log('6. Searching token in DB...');

        // Сначала ищем с учетом срока
        const storedToken = await this.prisma.refreshToken.findFirst({
            where: {
                tokenValue: oldRefreshToken,
                expiresAt: { gt: new Date() }
            }
        });

        console.log('7. Token found (not expired):', storedToken ? 'YES' : 'NO');

        if (!storedToken) {
            // Ищем без учета срока
            const anyToken = await this.prisma.refreshToken.findFirst({
                where: { tokenValue: oldRefreshToken }
            });

            console.log('8. Token exists in DB at all:', anyToken ? 'YES' : 'NO');

            if (anyToken) {
                console.log('9. Token expired at:', anyToken.expiresAt);
                console.log('10. Current server time:', new Date());
            } else {
                // Выведем все токены из БД для отладки
                const allTokens = await this.prisma.refreshToken.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' }
                });
                console.log('11. Recent tokens in DB:', allTokens.map(t => ({
                    id: t.id,
                    userId: t.userId,
                    tokenStart: t.tokenValue.substring(0, 30) + '...',
                    expiresAt: t.expiresAt
                })));
            }

            throw new UnauthorizedException('Refresh токен недействителен или истек');
        }

        console.log('12. Found token:', {
            id: storedToken.id,
            userId: storedToken.userId,
            expiresAt: storedToken.expiresAt
        });

        try {
            // Пробуем верифицировать
            console.log('13. Verifying token...');
            const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
            console.log('14. Using secret:', refreshSecret);

            const payload = this.jwt.verify(oldRefreshToken, {
                secret: refreshSecret
            });

            console.log('15. Verified payload:', JSON.stringify(payload, null, 2));

            if (payload.type !== 'refresh') {
                console.log('16. ❌ Wrong token type:', payload.type);
                throw new UnauthorizedException('Неверный тип токена');
            }

            console.log('17. Generating new tokens...');
            const { accessToken, refreshToken: newRefreshToken } =
                await this.generateTokensPair(
                    payload.id,
                    payload.role,
                    payload.email,
                );

            console.log('18. Deleting old token from DB...');
            await this.prisma.refreshToken.delete({
                where: { id: storedToken.id }
            });

            console.log('19. Setting cookies...');
            this.setCookies(res, newRefreshToken, accessToken);

            console.log('20. ✅ Tokens refreshed successfully');

            return {
                success: true,
                message: 'Токены успешно обновлены',
            };
        } catch (error) {
            console.log('21. ❌ Verification error:', error.message);
            console.log('22. Full error:', error);

            // Удаляем невалидный токен
            await this.prisma.refreshToken.delete({
                where: { id: storedToken.id }
            }).catch(() => { });

            throw new UnauthorizedException('Refresh токен истек или недействителен');
        }
    }

    private generateTwofactorCodes(count: number) {
        return Array.from({ length: count }, () =>
            crypto.randomInt(100000, 1000000).toString().padStart(6, '0')
        )
    }

    async sendAccountToVerification(id: number) {
        return await this.users.sendAccountToVerification(id)
    }
}