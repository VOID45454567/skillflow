import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create.course.dto';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) { }


  @Get()
  async getAll() {
    return await this.coursesService.getAll()
  }



  @Get('/my')
  @UseGuards(JwtAuthGuard)
  async getMy(@CurrentUser('id') id: string) {
    return await this.coursesService.getMy(Number(id))
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() dto: CreateCourseDto, @CurrentUser('id') userId: number) {
    return await this.coursesService.createCourse(dto, userId)
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getById(@Param('id') id: string) {
    return await this.coursesService.getById(Number(id))
  }

  @Patch(':id/make-paid')
  @UseGuards(JwtAuthGuard)
  async makeCoursePaid(@Param('id') id: string, @CurrentUser('id') userId: string, @Body('price') price: string) {
    const course = await this.coursesService.getById(Number(id))
    console.log(course?.userId);
    console.log(userId);

    if (course?.userId === Number(userId)) {
      return await this.coursesService.makeCoursePaid(Number(id), Number(price))
    }

    return new UnauthorizedException('Ты не владелец')
  }

  @Post(':id/buy')
  @UseGuards(JwtAuthGuard)
  async buyCourse(@Param('id') courseId: string, @CurrentUser('id') userId: string) {
    return await this.coursesService.buyCourse(Number(userId), Number(courseId))
  }
}
