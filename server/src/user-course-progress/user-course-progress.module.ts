import { Module } from '@nestjs/common';
import { UserCourseProgressService } from './user-course-progress.service';
import { UserCourseProgressController } from './user-course-progress.controller';
import { UsersService } from '@/users/users.service';
import { CoursesService } from '@/courses/courses.service';
import { TransactionService } from '@/transaction/transaction.service';
import { HeatmapService } from '@/heatmap/heatmap.service';
import { MinioService } from '@/minio/minio.service';
import { AdminActionsService } from '@/admin-actions/admin-actions.service';
import { AdminService } from '@/admin/admin.service';

@Module({
  controllers: [UserCourseProgressController],
  providers: [
    UserCourseProgressService,
    UsersService,
    CoursesService,
    TransactionService,
    HeatmapService,
    MinioService,
    AdminService,
    AdminActionsService
  ]
})
export class UserCourseProgressModule { }
