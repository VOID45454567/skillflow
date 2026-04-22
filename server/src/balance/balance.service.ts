import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpBalanceDto } from './dto/up.balance.dto';

@Injectable()
export class BalanceService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async deposit(dto: UpBalanceDto) {
        return await this.prisma.$transaction([
            this.prisma.payment.create({
                data: dto
            }),
            this.prisma.user.update({ where: { id: dto.userId }, data: { balance: { increment: dto.count } } })
        ])
    }
}
