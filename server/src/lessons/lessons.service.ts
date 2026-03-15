import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { Prisma__TransactionClient } from 'src/generated/prisma/models';
import { Prisma } from 'src/generated/prisma/client';

@Injectable()
export class LessonsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(dto: CreateLessonDto, moduleId: number) {
        return this.prisma.lesson.create({
            data: {
                content: dto.content,
                title: dto.title,
                moduleId: moduleId,
                description: dto.description,
                resources: dto.resourses,
                order: dto.order
            }
        })
    }
}
