import { Controller } from '@nestjs/common';
import { CourseModulesService } from './course-modules.service';

@Controller('course-modules')
export class CourseModulesController {
  constructor(private readonly courseModulesService: CourseModulesService) {}
}
