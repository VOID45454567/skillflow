import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtConfig } from '@/conf/jwt';
import { PrismaModule } from '@/prisma/prisma.module';
import { JwtStrategy } from '@/strategies/passport.jwt.strategy';
import { UsersModule } from '@/users/users.module';
import { UsersService } from '@/users/users.service';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { Client } from 'minio';
import { MinioService } from '@/minio/minio.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, UsersService, JwtAuthGuard, MinioService],
  imports: [
    PrismaModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: getJwtConfig,
      inject: [ConfigService]
    })
  ],
  exports: [JwtAuthGuard, AuthService]
})
export class AuthModule { }
