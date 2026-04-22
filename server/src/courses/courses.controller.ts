import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UnauthorizedException, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create.course.dto';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { MinioService } from '@/minio/minio.service';
import { AnyFilesInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UserCourseProgressService } from '@/user-course-progress/user-course-progress.service';

@Controller('courses')
export class CoursesController {
  constructor(
    private readonly coursesService: CoursesService,
    private readonly userCourseProgressService: UserCourseProgressService
  ) { }


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
  @UseInterceptors(AnyFilesInterceptor())
  async create(
    @Body('data') data: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('id') userId: number
  ) {

    const dto = JSON.parse(data) as CreateCourseDto;

    const enrichedDto = this.enrichDtoWithFiles(dto, files);

    return await this.coursesService.createCourse(enrichedDto, userId);
  }

  private enrichDtoWithFiles(dto: CreateCourseDto, files: Express.Multer.File[]): CreateCourseDto {
    const enrichedDto = JSON.parse(JSON.stringify(dto));

    const filesMap = new Map<string, Express.Multer.File>();
    files.forEach(file => {
      filesMap.set(file.fieldname, file);
    });

    const processSections = (obj: any, currentPath: string = '') => {
      if (!obj) return;

      if (Array.isArray(obj) && obj.length > 0 && obj[0]?.type) {
        obj.forEach((section: any, idx: number) => {
          if (section.type === 'media') {
            const filePath = `${currentPath}.${idx}.content`;
            const file = filesMap.get(filePath);

            if (file) {
              section.content = {
                buffer: file.buffer,
                originalName: file.originalname,
                mimeType: file.mimetype,
                size: file.size
              };
            } else if (section.content?.placeholder) {
              section.content = null;
            }
          }
        });
        return;
      }

      if (obj && typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          processSections(obj[key], newPath);
        });
      }
    };
    if (enrichedDto.modules) {
      enrichedDto.modules.forEach((module: any, mIdx: number) => {
        if (module.lessons) {
          module.lessons.forEach((lesson: any, lIdx: number) => {
            if (lesson.content?.sections) {
              const path = `modules.${mIdx}.lessons.${lIdx}.content.sections`;
              processSections(lesson.content.sections, path);
            }
          });
        }
      });
    }

    return enrichedDto;
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
  @HttpCode(HttpStatus.OK)
  async buyCourse(@Param('id') courseId: string, @CurrentUser('id') userId: string) {
    return await this.coursesService.buyCourse(Number(userId), Number(courseId))
  }


  @Post(':userId/gift/:courseId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async giftCourse(
    @CurrentUser('id') userId: number,
    @Param('userId', ParseIntPipe) giftToId: number,
    @Param('courseId', ParseIntPipe) courseId: number,
  ) {
    return await this.coursesService.gift(courseId, userId, giftToId)
  }

  @Post('refund/:courseId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async refundCourse(
    @CurrentUser('id') userId: number,
    @Param('courseId', ParseIntPipe) courseId: number
  ) {
    await this.coursesService.refund(courseId, userId),
      await this.userCourseProgressService.resetCourseProgress(courseId, userId)
  }

  @Patch('/:id/publish')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async publishCourse(
    @CurrentUser('id') userId: number,
    @Param('id', ParseIntPipe) courseId: number
  ) {
    return await this.coursesService.publishCourse(courseId)
  }
}
