import { Injectable } from '@nestjs/common';
import { RegisterDto } from '../auth/dto/register.dto';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(dto: RegisterDto) {
        return await this.prisma.user.create({ data: dto })
    }

    async getAll() {
        return await this.prisma.user.findMany()
    }

    async findById(id: number) {
        return await this.prisma.user.findUnique({ where: { id } })
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
}
