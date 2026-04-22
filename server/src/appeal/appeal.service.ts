import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppealService {
    constructor(
        private readonly prisma: PrismaService
    ) { }


    async create(banInfoId: number, text: string, userId: number) {
        return await this.prisma.appeal.create({
            data: {
                text,
                banInfoId,
                userId,
            }
        })

    }

}
