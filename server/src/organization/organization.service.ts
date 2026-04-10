import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { PrismaService } from '@/prisma/prisma.service';
import crypto from 'crypto'
import { UpdateOrganizationDto } from './dto/update.organization.dto';
import { CreateCourseDto } from '@/courses/dto/create.course.dto';
import { CoursesService } from '@/courses/courses.service';
import { InviteCodeDto } from './dto/invite.code.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { NextFunction } from 'express';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courses: CoursesService,
    private readonly mail: MailerService
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

  async sendInviteCode(dto: InviteCodeDto) {

    await this.isOwner(dto.userId, dto.orgId)

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

  async createCourse(dto: CreateCourseDto, creatorId: number, organizationId: number) {
    return await this.courses.createCourse({ ...dto, visibility: 'ORGANIZATION' }, creatorId, organizationId)
  }

  async getById(id: number) {
    return await this.prisma.organization.findUnique({ where: { id }, include: { organizationMembers: true } })
  }

  async getAll() {
    return await this.prisma.organization.findMany()
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
}
