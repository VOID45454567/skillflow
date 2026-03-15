import { Injectable } from '@nestjs/common';
import { CreateCourseModuleDto } from './dto/create.course.module.dto';
import { Prisma } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { LessonsService } from 'src/lessons/lessons.service';

@Injectable()
export class CourseModulesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly lessonsService: LessonsService
    ) { }

    async create(dto: CreateCourseModuleDto, courseId: number) {
        const newModule = await this.prisma.module.create({
            data: {
                title: dto.title,
                courseId: courseId,
                order: dto.order,
                description: dto.description,
            }
        })
        const newLessons = dto.lessons!.forEach(async (lesson) => {
            await this.lessonsService.create(lesson, newModule.id)
        })

        return Promise.all([newModule, newLessons])
    }
}
