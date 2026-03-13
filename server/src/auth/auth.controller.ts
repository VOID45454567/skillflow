import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Delete
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from '../guards/jwt.auth.guard';
import { User } from '../decorators/User';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @User('id') userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.logout(userId, res);
    return { message: 'Выход выполнен успешно' };
  }

  /**
   * ОБНОВЛЕНИЕ ТОКЕНОВ
   * POST /auth/refresh
   */
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Refresh токен не найден'
      };
    }

    return this.authService.refreshTokens(refreshToken, res, req);
  }

  /**
   * ПОЛУЧЕНИЕ ИНФОРМАЦИИ О ТЕКУЩЕМ ПОЛЬЗОВАТЕЛЕ
   * GET /auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    return this.authService.getMe(req);
  }

  /**
   * ВКЛЮЧЕНИЕ 2FA И ГЕНЕРАЦИЯ BACKUP КОДОВ
   * POST /auth/2fa/setup
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/setup')
  @HttpCode(HttpStatus.OK)
  async setupTwoFactor(
    @User('id') userId: number
  ) {
    return this.authService.setTwoFactorBackupCode(userId);
  }

  /**
   * ПРОВЕРКА 2FA КОДА ПРИ ВХОДЕ
   * POST /auth/2fa/verify
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  @HttpCode(HttpStatus.OK)
  async verifyTwoFactor(
    @User('id') userId: number,
    @Body('code') code: string
  ) {
    const isValid = await this.authService.verifyTwoFactorCode(userId, code);

    if (!isValid) {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Неверный код'
      };
    }

    return {
      message: 'Код подтвержден',
      verified: true
    };
  }

  /**
   * ОТКЛЮЧЕНИЕ 2FA
   * POST /auth/2fa/disable
   */
  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable')
  @HttpCode(HttpStatus.OK)
  async disableTwoFactor(
    @User('id') userId: number
  ) {
    return this.authService.disableTwoFactor(userId);
  }

  @Get('check')
  @HttpCode(HttpStatus.OK)
  async checkAuth(@Req() req: Request) {
    try {
      const accessToken = req.cookies['access_token'];

      if (!accessToken) {
        return { authenticated: false };
      }

      const payload = this.authService.jwtService.verify(accessToken);
      const user = await this.authService.users.findById(payload.sub);

      return {
        authenticated: true,
        user: user ? { id: user.id, email: user.email, role: user.role } : null
      };
    } catch {
      return { authenticated: false };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('revoke-all')
  @HttpCode(HttpStatus.OK)
  async revokeAllTokens(
    @User('id') userId: number,
    @Res({ passthrough: true }) res: Response
  ) {
    await this.authService.revokeAllUserTokens(userId);

    return {
      message: 'Все остальные сессии завершены'
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('sessions')
  @HttpCode(HttpStatus.OK)
  async getActiveSessions(@User('id') userId: number) {
    const sessions = await this.authService.prisma.refreshToken.findMany({
      where: {
        userId,
        isRevoked: false
      },
      select: {
        id: true,
        createdAt: true,
        expiriesAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return { sessions };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  @HttpCode(HttpStatus.OK)
  async terminateSession(
    @User('id') userId: number,
    @Param('sessionId', ParseIntPipe) sessionId: number
  ) {
    const session = await this.authService.prisma.refreshToken.findFirst({
      where: {
        id: sessionId,
        userId
      }
    });

    if (!session) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Сессия не найдена'
      };
    }

    await this.authService.revokeRefreshToken(sessionId);

    return {
      message: 'Сессия завершена'
    };
  }
}