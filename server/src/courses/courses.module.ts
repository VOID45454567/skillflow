import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { CourseModulesService } from 'src/course.modules/course.modules.service';
import { LessonsService } from 'src/lessons/lessons.service';

@Module({
  controllers: [CoursesController],
  providers: [CoursesService, CourseModulesService, LessonsService],
})
export class CoursesModule { }
