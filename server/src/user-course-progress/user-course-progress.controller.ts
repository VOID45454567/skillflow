import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { UserCourseProgressService } from './user-course-progress.service';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { CurrentUser } from '@/decorators/current.user.decrator';

@Controller('user-course-progress')
@UseGuards(JwtAuthGuard)
export class UserCourseProgressController {
  constructor(private readonly userCourseProgressService: UserCourseProgressService) { }

  @Post('courses/:courseId/start')
  @HttpCode(HttpStatus.OK)
  async startCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number
  ) {
    return await this.userCourseProgressService.startCourse(courseId, userId);
  }

  @Post('lessons/:lessonId/complete')
  @HttpCode(HttpStatus.OK)
  async completeLesson(
    @Param('lessonId', ParseIntPipe) lessonId: number,
    @CurrentUser('id') userId: number

  ) {
    return await this.userCourseProgressService.completeLesson(lessonId, userId);
  }

  @Post('modules/:moduleId/complete')
  @HttpCode(HttpStatus.OK)
  async completeModule(
    @Param('moduleId', ParseIntPipe) moduleId: number,
    @CurrentUser('id') userId: number

  ) {
    return await this.userCourseProgressService.completeModule(moduleId, userId);
  }

  @Post('courses/:courseId/complete')
  @HttpCode(HttpStatus.OK)
  async completeCourse(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number

  ) {
    return await this.userCourseProgressService.completeCourse(courseId, userId);
  }

  @Get('courses/:courseId')
  async getCourseProgress(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number

  ) {
    return await this.userCourseProgressService.getUserCourseProgress(userId, courseId);
  }

  @Get('my')
  async getMyProgresses(
    @CurrentUser('id') userId: number
  ) {
    return await this.userCourseProgressService.getAllUserProgresses(userId);
  }

  @Get('users/:userId')
  async getUserProgresses(@Param('userId', ParseIntPipe) userId: number) {
    return await this.userCourseProgressService.getAllUserProgresses(userId);
  }

  @Delete('courses/:courseId/reset')
  @HttpCode(HttpStatus.OK)
  async resetCourseProgress(
    @Param('courseId', ParseIntPipe) courseId: number,
    @CurrentUser('id') userId: number

  ) {
    return await this.userCourseProgressService.resetCourseProgress(courseId, userId);
  }

  @Get('courses/:courseId/statistics')
  async getCourseStatistics(@Param('courseId', ParseIntPipe) courseId: number) {
    return await this.userCourseProgressService.getCourseStatistics(courseId);
  }
}
