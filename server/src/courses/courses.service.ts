import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseDto } from './dto/create.course.dto';
import { CourseModulesService } from 'src/course.modules/course.modules.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly modulesService: CourseModulesService
    ) { }

    async create(dto: CreateCourseDto, userId: number) {
        const newCourse = await this.prisma.course.create({
            data: {
                title: dto.title,
                authorId: userId,
                description: dto.description,
                level: dto.level,
                type: dto.type,
                organizationId: dto.organizationId,

            }
        })
        const newModules = dto.modules!.forEach(async (module) => {
            await this.modulesService.create(module, newCourse.id)
        })


        const newCategories = dto.categories.map(async (categoryId) => {
            await this.prisma.courseCategory.create({
                data: {
                    categoriesId: categoryId,
                    goalsId: newCourse.id
                }
            })
        })
        const newTags = dto.tags.map(async (tagsId) => {
            await this.prisma.courseTag.create({
                data: {
                    tagsId: tagsId,
                    goalsId: newCourse.id
                }
            })
        })
        return Promise.all([newModules, newCategories, newTags])
    }

    async publish(id: number) {
        return await this.prisma.course.update({
            where: { id }, data: {
                status: 'PUBLISHED'
            }
        })
    }

    async sendCourseToVerification(id: number) {
        return await this.prisma.course.update({
            where: { id }, data: {
                verificationStatus: 'PENDING'
            }
        })
    }

    async makeItPaid(id: number, price: number) {
        return await this.prisma.course.update({
            where: { id }, data: {
                price: price
            }
        })
    }

    async getOne(id: number) {
        return await this.prisma.course.findUnique({
            where: { id },
            include: {
                modules: true,
                purchases: true,
                reviews: true,
                author: true,
            }
        })
    }

    async buyCourse(userId: number, courseId: number) {
        return await this.prisma.purchasedCourses.create({
            data: {
                courseId: courseId,
                userId: userId
            }
        })
    }

    async getMyPurchasedCourses(userId: number) {
        return await this.prisma.purchasedCourses.findMany({
            where: { userId },
            include: {
                course: true
            }
        })
    }

    async getPublishedCourses() {
        return await this.prisma.course.findMany({
            where: { status: 'PUBLISHED', type: 'FREE' }, orderBy: { verificationStatus: 'desc', rating: 'desc' }
        })
    }
}
