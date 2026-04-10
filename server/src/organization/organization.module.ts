import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CoursesService } from '@/courses/courses.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/strategies/passport.jwt.strategy';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { TransactionService } from '@/transaction/transaction.service';
import { MinioService } from '@/minio/minio.service';

@Module({
  controllers: [OrganizationController],
  providers: [
    OrganizationService,
    CoursesService,
    JwtStrategy,
    JwtAuthGuard,
    TransactionService,
    MinioService
  ],
})
export class OrganizationModule { }
