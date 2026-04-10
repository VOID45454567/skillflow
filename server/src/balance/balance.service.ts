import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BalanceService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async deposit(userId: number, count: number) {
        return await this.prisma.$transaction([
            this.prisma.payment.create({
                data: { count, userId }
            }),
            this.prisma.user.update({ where: { id: userId }, data: { balance: { increment: count } } })
        ])
    }
}
