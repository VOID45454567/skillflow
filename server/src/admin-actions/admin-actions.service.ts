import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAdminActionDto } from './dto/create.admin.action.dto';

@Injectable()
export class AdminActionsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(dto: CreateAdminActionDto, currentAdminId: number) {

        return await this.prisma.adminActions.create({
            data: {
                actionType: dto.actionType,
                reason: dto.reason,
                targetUserId: dto.targetUser,
                userId: currentAdminId
            }
        })
    }

    async getAll() {
        return await this.prisma.adminActions.findMany({ include: { admin: true } });
    }
}
