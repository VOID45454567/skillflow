import { Module } from '@nestjs/common';
import { CourseModulesService } from './course.modules.service';
import { CourseModulesController } from './course.modules.controller';
import { LessonsService } from 'src/lessons/lessons.service';

@Module({
  controllers: [CourseModulesController],
  providers: [CourseModulesService, LessonsService],
})
export class CourseModulesModule { }
