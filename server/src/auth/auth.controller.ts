import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Delete,
  Patch,
  Param,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Verify2faDto } from './dto/verify-2fa.dto';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { User } from '../../prisma/generated/prisma';
import { UsersService } from '@/users/users.service';
import { MinioService } from '@/minio/minio.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly minioService: MinioService
  ) { }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(dto, res);
    return {
      success: true,
      message: 'Регистрация успешна',
      user: {
        id: result.id,
        email: result.email,
        login: result.login,
        role: result.role,
      },
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto, res);

    if ('requiresTwoFactor' in result && result.requiresTwoFactor) {
      const twoFactorResult = result as { requiresTwoFactor: boolean; userId: number };
      return {
        success: true,
        requiresTwoFactor: true,
        message: 'Требуется подтверждение 2FA',
        userId: twoFactorResult.userId,
      };
    }

    const userResult = result as User;
    return {
      success: true,
      message: 'Вход выполнен успешно',
      user: userResult
    };
  }

  @Post('verify-2fa')
  @HttpCode(HttpStatus.OK)
  async verify2fa(
    @Body() dto: Verify2faDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verify2fa(dto.code, dto.userId, res);

    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }

    return {
      success: true,
      message: '2FA подтвержден, вход выполнен',
      data: {
        user: result.user,
      },
    };
  }

  @Post('2fa/send-code')
  @HttpCode(HttpStatus.OK)
  async sendVerificationCode(@Body('userId') userId: number) {
    return await this.authService.sendVerificationCode(userId)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    await this.authService.logout(res);
    return {
      success: true,
      message: 'Выход выполнен успешно',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser('id') id: number) {
    return this.usersService.findById(id)
  }

  @Post('2fa/enable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async enable2fa(@CurrentUser('id') userId: number) {
    const result = await this.authService.enable2fa(userId);

    return {
      success: true,
      message: '2FA успешно включен',
      data: {
        backupCodes: result.codes,
        warning: 'Сохраните резервные коды в надежном месте',
      },
    };
  }

  @Delete('2fa/disable')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async disable2fa(@CurrentUser('id') userId: number) {
    await this.authService.disable2fa(userId);

    return {
      success: true,
      message: '2FA успешно отключен',
    };
  }

  @Post('2fa/regenerate-codes')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async regenerate2faCodes(@CurrentUser('id') userId: number) {
    const codes = await this.authService.regenerate2faCodes(userId);

    return {
      success: true,
      message: 'Новые резервные коды сгенерированы',
      data: {
        backupCodes: codes,
      },
    };
  }

  @Get('2fa/status')
  @UseGuards(JwtAuthGuard)
  async get2faStatus(@CurrentUser('id') userId: number) {
    const status = await this.authService.get2faStatus(userId);

    return {
      success: true,
      data: status,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refreshToken;


    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    await this.authService.refreshTokens(refreshToken, res);

    console.log('токены обновленны');

    return {
      success: true,
      message: 'Токены обновлены',
    };
  }

  @Patch('verif/send/:id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async sendToVerification(@Param('id') id: string) {
    return await this.usersService.sendAccountToVerification(Number(id))
  }

  @Post('avatar/upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('id') userId: number
  ) {
    const result = await this.minioService.uploadAvatar(userId, file);

    await this.usersService.uploadAvatar(result.url, userId)

    return result;
  }

  @Delete('avatar/remove')
  @UseGuards(JwtAuthGuard)
  async removeAvatar(
    @CurrentUser('id') userId: number,
    @Body('filename') filename: string
  ) {
    return await this.minioService.deleteFile(filename)
  }


}

