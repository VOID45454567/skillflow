import { Controller, Get, Post, Body, Param, Delete, UseGuards, Patch, UnauthorizedException, ParseIntPipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { JwtAuthGuard } from '@/guards/jwt.auth.guard';
import { CurrentUser } from '@/decorators/current.user.decrator';
import { UpdateOrganizationDto } from './dto/update.organization.dto';
import { InviteCodeDto } from './dto/invite.code.dto';
import { CreateCourseDto } from '@/courses/dto/create.course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioService } from '@/minio/minio.service';

@UseGuards(JwtAuthGuard)
@Controller('organization')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly minioService: MinioService
  ) { }

  @Post()
  async create(@Body() dto: CreateOrganizationDto, @CurrentUser('id') userId: number) {
    return await this.organizationService.create(dto, userId)
  }

  @Post('invite')
  async sendInviteCode(@Body() dto: InviteCodeDto) {
    return await this.organizationService.sendInviteCode(dto)
  }


  @Post('logo/upload/:id')
  @UseInterceptors(FileInterceptor('logo'))
  async updateLogo(
    @Param('id', ParseIntPipe) orgId: number,
    @UploadedFile('logo') logo: Express.Multer.File
  ) {
    const result = this.minioService.uploadOrganizationLogo(orgId, logo)

    return result
  }

  @Post('create-course/:id')
  async createCourse(@Body() dto: CreateCourseDto, @CurrentUser('id') creatorId: number, @Param('id', ParseIntPipe) orgId: number) {
    return await this.organizationService.createCourse(dto, creatorId, orgId)
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
  async addMember(@Param('orgId') orgId: string, @Body('userId') userId: string) {
    return await this.organizationService.addMember(Number(userId), Number(orgId))
  }

  @Delete('/remove-member/:orgId')
  async deleteMember(@Param('orgId') orgId: string, @Body('userId') userId: string) {
    return await this.organizationService.removeMember(Number(userId), Number(orgId))
  }

}
