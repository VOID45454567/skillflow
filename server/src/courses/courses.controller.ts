import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from 'src/guards/jwt.auth.guard';
import { CreateCourseDto } from './dto/create.course.dto';
import { User } from 'src/decorators/User';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCourseDto, @User('id') userId: number) {
    return await this.coursesService.create(dto, userId)
  }

  @Patch('/:id/send-to-verif')
  async sendToVerification(@Param('id') id: string) {
    return this.coursesService.sendCourseToVerification(+id)
  }

  @Patch('/:id/make-paid')
  async makeCoursePaid(@Param('id') id: string, @Body('price') price: string) {
    return this.coursesService.makeItPaid(+id, +price)
  }

  @Get('')
  async getPublished() {
    return await this.coursesService.getPublishedCourses()
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:id/publish')
  async publishCourse(@Param('id') id: string) {
    return await this.coursesService.publish(+id)
  }

  @UseGuards(JwtAuthGuard)
  @Post('/:id/purchase')
  async buyCourse(@Param('id') courseId: string, @User('userId') userId: string) {
    return await this.coursesService.buyCourse(+userId, +courseId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/my/purchased')
  async getMyPurchased(@User('userId') id: string) {
    return await this.coursesService.getMyPurchasedCourses(+id)
  }
}
