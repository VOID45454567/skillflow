import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ActionsTypes, UserVerificationStatuses } from '../../prisma/generated/prisma';
import { AdminActionsService } from '@/admin-actions/admin-actions.service';
import { SetVerificationStatusDto } from './dto/set.verification.status.dto';

@Injectable()
export class AdminService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly adminActions: AdminActionsService
    ) { }

    async blockUser(bannedId: number, bannedBy: number, reason: string) {
        const newBlock = await this.prisma.blockInfo.create({
            data: {
                blockReason: reason,
                bannedBy,
                bannedId
            }
        })
        const newAdminAction = await this.adminActions.create({ actionType: 'BAN', reason: reason, targetUser: bannedId }, bannedBy)
        return Promise.all([newBlock, newAdminAction])
    }

    async setVerificationStatus(adminId: number, userId: number, dto: SetVerificationStatusDto) {
        const newVerifStatus = await this.prisma.user.update({
            where: { id: userId }, data: {
                verificationStatus: dto.newStatus
            }
        })

        const newAdminAction = await this.adminActions.create({ actionType: dto.actionType, reason: dto.reason, targetUser: userId }, adminId)

        return Promise.all([newVerifStatus, newAdminAction])

    }

    async unblockUser(bannedId: number, unbannedBy: number, reason: string) {
        const banInfo = await this.prisma.blockInfo.findFirst({ where: { bannedId: bannedId } })

        if (!banInfo) {
            throw new NotFoundException('Информации о блокировке не обнаруженно')
        }

        const unblock = await this.prisma.blockInfo.delete({ where: { id: banInfo.id } })

        const adminAction = await this.adminActions.create({ actionType: 'UNBAN', reason: reason, targetUser: bannedId }, unbannedBy)

        return Promise.all([unblock, adminAction])

    }

    async getTransactions() {
        return await this.prisma.transaction.findMany()
    }

    async getTagsAndCategories() {
        return await this.prisma.term.findMany()
    }

    async getPayments() {
        return await this.prisma.payment.findMany()
    }

    async getUserTransactions(userId: number) {
        return await this.prisma.transaction.findMany({ where: { userId: userId } })
    }

    async getUserPayments(userId: number) {
        return await this.prisma.payment.findMany({ where: { userId } })
    }

    async getUsersOnVerification() {
        return await this.prisma.user.findMany({ where: { verificationStatus: 'PENDING' } })
    }

    async getAppeals() {
        return await this.prisma.appeal.findMany()
    }

    async getOneAppeal(id: number) {
        return await this.prisma.appeal.findUnique({ where: { id } })
    }

    async getAppealByUserId(userId: number) {
        return await this.prisma.appeal.findFirst({ where: { userId: userId } })
    }
}
