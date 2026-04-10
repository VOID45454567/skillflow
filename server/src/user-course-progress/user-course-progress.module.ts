import { Module } from '@nestjs/common';
import { UserCourseProgressService } from './user-course-progress.service';
import { UserCourseProgressController } from './user-course-progress.controller';
import { UsersService } from '@/users/users.service';
import { CoursesService } from '@/courses/courses.service';
import { TransactionService } from '@/transaction/transaction.service';
import { HeatmapService } from '@/heatmap/heatmap.service';

@Module({
  controllers: [UserCourseProgressController],
  providers: [UserCourseProgressService, UsersService, CoursesService, TransactionService, HeatmapService]
})
export class UserCourseProgressModule { }
