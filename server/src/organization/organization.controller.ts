import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, UnauthorizedException, ParseIntPipe, UploadedFile, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { UpdateOrganizationDto } from './dto/update.organization.dto';
import { InviteCodeDto } from './dto/invite.code.dto';
import { CreateCourseDto } from '@/courses/dto/create.course.dto';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MinioService } from '@/minio/minio.service';
import { CoursesService } from '@/courses/courses.service';
import { CoursesController } from '@/courses/courses.controller';

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly minioService: MinioService,
    private readonly coursesController: CoursesController,
  ) { }

  @Post()
  async create(@Body() dto: CreateOrganizationDto, @CurrentUser('id') userId: number) {
    return await this.organizationService.create(dto, userId)
  }


  @UseGuards(JwtAuthGuard)
  @Post('invite')
  async sendInviteCode(
    @Body() dto: InviteCodeDto,
    @CurrentUser('id') id: number
  ) {
    return await this.organizationService.sendInviteCode(dto, id)
  }


  @Post('logo/upload/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateLogo(
    @Param('id', ParseIntPipe) orgId: number,
    @UploadedFile() logo: Express.Multer.File
  ) {
    const result = await this.minioService.uploadOrganizationLogo(orgId, logo)
    await this.organizationService.uploadLogo(result.url, orgId)
    return result
  }


  @Post(':id/gallery/upload')
  @UseInterceptors(FilesInterceptor("files", 10))
  async uploadGallery(
    @Param('id', ParseIntPipe) orgId: number,
    @CurrentUser('id') currentUserId: number,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const uploadResult = await this.minioService.uploadOrganizationGallery(orgId, files)

    const filesUrls = uploadResult.map((result) => result.url)

    await this.organizationService.uploadGallery(orgId, filesUrls, currentUserId)

    return uploadResult
  }

  @Delete(':id/gallery/remove')
  async removeFromGallery(
    @Body('filename') fileName: string,
    @Param('id', ParseIntPipe) orgId: number,
    @CurrentUser('id') userId: number
  ) {
    return await this.organizationService.removeFromGallery(orgId, fileName, userId)
  }


  @Post('create-course/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async createCourse(
    @Body('data') data: string,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser('id') userId: number
  ) {
    return await this.coursesController.create(data, files, userId);
  }

  @Get()
  async getAll() {
    return await this.organizationService.getAll()
  }


  @Get(':id')
  async getById(@Param('id') id: string) {
    return await this.organizationService.getById(Number(id))
  }


  @Patch(':id')
  async update(@Body() dto: UpdateOrganizationDto, @Param('id') id: string, @CurrentUser('id') userId: number) {
    const organization = await this.organizationService.getById(Number(id))

    if (organization!.userId !== userId) {
      throw new UnauthorizedException('Вы не являетесь владельцем организации')
    }

    return await this.organizationService.update(dto, Number(id))
  }

  @Post('/add-member/:orgId')
  async addMember(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @CurrentUser('id', ParseIntPipe) currentUserId: number
  ) {
    return await this.organizationService.addMember(userId, orgId, currentUserId)
  }

  @Delete('/remove-member/:orgId')
  async deleteMember(
    @Param('orgId', ParseIntPipe) orgId: number,
    @Body('userId', ParseIntPipe) userId: number,
    @CurrentUser('id', ParseIntPipe) currentUserId: number
  ) {
    return await this.organizationService.removeMember(userId, orgId, currentUserId)
  }

}
