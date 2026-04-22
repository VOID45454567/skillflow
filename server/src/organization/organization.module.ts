import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { CoursesService } from '@/courses/courses.service';
import { JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '@/strategies/passport.jwt.strategy';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { TransactionService } from '@/transaction/transaction.service';
import { MinioService } from '@/minio/minio.service';
import { CoursesController } from '@/courses/courses.controller';
import { UserCourseProgressService } from '@/user-course-progress/user-course-progress.service';
import { HeatmapService } from '@/heatmap/heatmap.service';

@Module({
  controllers: [OrganizationController, CoursesController],
  providers: [
    OrganizationService,
    CoursesService,
    JwtStrategy,
    JwtAuthGuard,
    TransactionService,
    MinioService,
    CoursesController,
    UserCourseProgressService,
    HeatmapService
  ],
})
export class OrganizationModule { }
