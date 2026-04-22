import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ReviewService {
    constructor(
        private readonly prisma: PrismaService
    ) { }


    async create(userId: number, text: string, courseId: number) {
        return await this.prisma.review.create({
            data: {
                text: text,
                userId: userId,
                courseId: courseId,
            }
        })
    }

    // async getAllByCourse(courseId: number) {
    //     return await this.prisma.review.findMany({ where: { courseId } })
    // } TODO: Возможно не нужен
}
