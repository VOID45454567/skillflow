import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create.course.dto';
import { CreateCourseModuleDto } from './dto/create.module.dto';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { TransactionService } from '@/transaction/transaction.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly transactions: TransactionService
    ) { }
    async getAll() {
        return await this.prisma.course.findMany({
            include: {
                modules: {
                    include: {
                        lessons: true
                    }
                },

            }
        })
    }

    async getMy(userId: number) {
        return await this.prisma.course.findMany({ where: { userId: userId } })
    }

    async getById(id: number) {
        return await this.prisma.course.findUnique({ where: { id } })
    }

    async buyCourse(userId: number, courseId: number) {
        const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { purchasedCourses: true } })
        const course = await this.prisma.course.findUnique({ where: { id: courseId } })

        if (!course || !user) {
            throw new NotFoundException('Курс или пользователь не найденн');
        }

        if (course.userId === userId) {
            throw new ConflictException('Вы не можете купить собственный курс')
        }

        if (course.price && (course.price! > user.balance)) {
            throw new BadRequestException(
                `Недостаточно средств на счету, пополните балланс на ${course.price - user.balance}`
            )
        }

        if (user.purchasedCourses.find((course) => (course.courseId === courseId))) {
            throw new ConflictException('Нельзя купить курс дважды')
        }

        const transaction = await this.transactions.create({ courseId: course.id, userId: user.id })
        const purchasedCourse = await this.prisma.purchasedCourse.create({
            data: {
                courseId: course.id,
                userId: userId
            }
        })

        return Promise.all([transaction, purchasedCourse])
    }


    async createCourse(dto: CreateCourseDto, creatorId: number, orgId?: number) {

        const modules = dto.modules

        const newCourse = await this.prisma.course.create({
            data: {
                title: dto.title,
                description: dto.description,
                userId: creatorId,
                visibility: dto.visibility,
                isFree: dto.isFree,
                price: dto.price || null,
                organizationId: orgId || null
            }
        })

        if (dto.termIds && dto.termIds.length > 0) {
            await this.prisma.courseTerm.createMany({
                data: dto.termIds.map((term) => ({
                    termId: term,
                    courseId: newCourse.id
                }))
            })
        }

        if (modules && modules.length > 0) {
            for (let i = 0; i < modules.length; i++) {
                await this.createModule(modules[i], newCourse.id)
            }
        }

        return newCourse
    }


    private async createModule(dto: CreateCourseModuleDto, courseId: number) {
        const lessons = dto.lessons

        const newModule = await this.prisma.courseModule.create({
            data: {
                description: dto.description,
                title: dto.title,
                courseId: courseId,
            }
        })

        if (lessons && lessons.length > 0) {
            for (let i = 0; i < lessons.length; i++) {
                await this.createLesson(lessons[i], newModule.id)
            }
        }

        return newModule
    }

    private async createLesson(dto: CreateLessonDto, moduleId: number) {
        return await this.prisma.lesson.create({
            data: {
                order: dto.order,
                content: dto.content,
                goals: dto.goals,
                courseModuleId: moduleId,
                title: dto.title
            }
        })
    }

    async makeCoursePaid(id: number, price: number) {
        const course = await this.prisma.course.findUnique({
            where: { id }
        })

        if (!course) {
            throw new BadRequestException('Курс не найден')
        }

        if (course.isFree === false) {
            throw new BadRequestException('Курс уже является платным')
        }

        return await this.prisma.course.update({
            where: { id }, data: {
                isFree: false,
                price: price,
            }
        })
    }
}