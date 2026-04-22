import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { PrismaService } from '@/prisma/prisma.service';
import crypto from 'crypto'
import { UpdateOrganizationDto } from './dto/update.organization.dto';
import { CreateCourseDto } from '@/courses/dto/create.course.dto';
import { CoursesService } from '@/courses/courses.service';
import { InviteCodeDto } from './dto/invite.code.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NextFunction } from 'express';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courses: CoursesService,
    private readonly mail: MailerService,
    private readonly minio: MinioService
  ) { }

  async create(dto: CreateOrganizationDto, userId: number) {

    const inviteCode = crypto.randomInt(100000000, 10000000000).toString().padStart(9, '0')

    return await this.prisma.organization.create({ data: { ...dto, inviteCode, userId } })
  }

  async update(dto: UpdateOrganizationDto, id: number) {
    return await this.prisma.organization.update({ where: { id }, data: dto })
  }

  async addMember(userId: number, organizationId: number, currentUserId: number) {

    return await this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId
      }
    })
  }

  async sendInviteCode(dto: InviteCodeDto, currenUser: number) {

    await this.isOwner(currenUser, dto.orgId)

    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } })
    const organization = await this.getById(dto.orgId)


    try {
      await this.mail.sendMail({
        to: user!.email,
        subject: 'Вы приглашенны в организацию',
        text: `Здравствуйте ${user!.login} Вы были приглаженны в огранизацию ${organization!.name}, ниже код приглажения - ${organization!.inviteCode}`
      })
      console.log('email sended');

    } catch (error) {
      console.log('error in mail send ' + error);

    }

    return { message: 'email sended' }
  }

  async removeMember(userId: number, organizationId: number, currentUserId: number) {

    await this.isOwner(currentUserId, organizationId)

    return await this.prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      }
    })
  }

  async createCourse(dto: CreateCourseDto, creatorId: number) {
    return await this.courses.createCourse({ ...dto, visibility: 'ORGANIZATION' }, creatorId)
  }

  async getById(id: number) {
    return await this.prisma.organization.findUnique({ where: { id }, include: { organizationMembers: { include: { user: true } }, owner: true, courses: { include: { lessons: true } } } })
  }

  async getAll() {
    return await this.prisma.organization.findMany({ include: { organizationMembers: { include: { user: true } }, owner: true, courses: true } })
  }

  async getAllOrganizationCourses(id: number) {
    return await this.prisma.organization.findUnique({ where: { id } }).courses()
  }


  private async isOwner(userId: number, orgId: number): Promise<void> {

    const organization = await this.prisma.organization.findUnique({
      where: { id: orgId }
    });

    if (!organization) {
      throw new NotFoundException('Организация не найдена');
    }



    if (organization.userId !== userId) {
      throw new UnauthorizedException('Вы не являетесь владельцем организации');
    }
  }


  async uploadLogo(fileUrl: string, orgId: number) {
    return await this.prisma.organization.update({
      where: { id: orgId }, data: {
        logo: fileUrl
      }
    })
  }

  async uploadGallery(orgId: number, fileUrls: string[], currentUserId: number) {

    await this.isOwner(currentUserId, orgId)

    return await this.prisma.organization.update({
      where: { id: orgId }, data: {
        images: fileUrls
      }
    })
  }

  async removeFromGallery(orgId: number, fileUrl: string, currentUserId: number) {
    // Проверяем права владельца
    await this.isOwner(currentUserId, orgId);

    // Получаем организацию
    const org = await this.getById(orgId);

    if (!org) {
      throw new NotFoundException('Организация не найдена');
    }

    const fileName = this.extractFilePathFromUrl(fileUrl);

    if (!fileName) {
      throw new BadRequestException('Некорректный URL изображения');
    }

    const expectedPath = `organizations/org_${orgId}/gallery/`;
    if (!fileName.includes(expectedPath)) {
      throw new BadRequestException('Изображение не принадлежит галерее этой организации');
    }

    // Проверяем, что изображение есть в массиве images
    const imageExists = org.images.some(image => {
      const imagePath = this.extractFilePathFromUrl(image);
      return imagePath === fileName;
    });

    if (!imageExists) {
      throw new NotFoundException('Изображение не найдено в галерее организации');
    }

    try {
      await this.minio.deleteFile(fileName);
    } catch (error) {
      console.error('Failed to delete file from storage:', error);
    }

    const finalGallery = org.images.filter((image) => {
      const imagePath = this.extractFilePathFromUrl(image);
      return imagePath !== fileName;
    });

    const updatedOrg = await this.prisma.organization.update({
      where: { id: orgId },
      data: {
        images: finalGallery
      }
    });

    return {
      message: 'Изображение успешно удалено из галереи',
      removedFile: fileName,
      remainingImages: finalGallery.length
    };
  }

  private extractFilePathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      let pathname = urlObj.pathname.substring(1);

      pathname = decodeURIComponent(pathname);

      return pathname;
    } catch (error) {
      console.error('Failed to parse URL:', error);
      return null;
    }
  }

  async getGallery(orgId: number) {
    return await this.prisma.organization.findUnique({
      where: { id: orgId }, select: {
        images: true
      }
    })
  }
}
