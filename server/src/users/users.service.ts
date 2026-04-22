import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AdminService } from '@/admin/admin.service';

@Injectable()
export class UsersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminService: AdminService
    ) { }

    async create(dto: RegisterDto) {
        return await this.prisma.user.create({ data: dto })
    }

    async getAll() {
        return await this.prisma.user.findMany()
    }

    async findById(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id }, include: {
                courses: true,
                purchasedCourses: {
                    include: {
                        course: true
                    }
                },
                transactions: true,
                payments: true,
                userCourseProgresses: true,
                heatmapDatas: true,
                bannedByUsers: { select: { bannedByUser: true, blockReason: true, createdAt: true, id: true } },
                appeals: true
            }
        })

        return { ...user, purchasedCourses: user?.purchasedCourses.map((course) => course.course) }
    }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email: email } })
    }

    async uploadAvatar(filePath: string, userId: number) {
        return await this.prisma.user.update({
            where: { id: userId }, data: {
                avatarUrl: filePath
            }
        })
    }

    async sendAccountToVerification(id: number) {
        return await this.prisma.user.update({
            where: { id }, data: {
                verificationStatus: 'PENDING'
            }
        })
    }

    async getUserTransactions(id: number) {
        return await this.adminService.getUserTransactions(id)
    }

    async getUserPayments(id: number) {
        return await this.adminService.getUserPayments(id)
    }

}
