import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create.transaction.dto';

@Injectable()
export class TransactionService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create({ courseId, userId, type }: CreateTransactionDto) {

        const course = await this.prisma.course.findUnique({ where: { id: courseId } })

        return await this.prisma.transaction.create({
            data: {
                courseId,
                userId,
                price: course?.price!,
                type
            }
        })
    }

    async getAll() {
        return await this.prisma.transaction.findMany()
    }

    async getAllUserTransActions(id: number) {
        return this.prisma.transaction.findMany({ where: { userId: id } })
    }
}
