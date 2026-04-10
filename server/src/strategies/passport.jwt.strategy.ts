import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private configService: ConfigService,
        private prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies?.accessToken;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_SECRET'),
        });
    }

    async validate(payload: { id: number; email: string; role: string }) {
        const user = await this.prisma.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                email: true,
                login: true,
                role: true,
                avatarUrl: true,
                enabledTwoFactor: true,
                createdAt: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException('Пользователь не найден');
        }

        return user;
    }
}