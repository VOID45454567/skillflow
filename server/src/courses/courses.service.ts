import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create.course.dto';
import { CreateLessonDto } from './dto/create.lesson.dto';
import { TransactionService } from '@/transaction/transaction.service';
import { MinioService } from '@/minio/minio.service';

@Injectable()
export class CoursesService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly transactions: TransactionService,
        private readonly minio: MinioService
    ) { }
    async getAll() {
        const courses = await this.prisma.course.findMany({
            include: {
                lessons: true,
                courseTerms: {
                    select: {
                        term: {
                            select: {
                                name: true,
                                type: true
                            }
                        }
                    }
                },
                user: true,
                userCourseProgresses: true
            }
        })
        const result = courses.map((course) => ({
            ...course,
            courseTerms: course.courseTerms.map(ct => ct.term)
        }));

        return result
    }

    async getMy(userId: number) {
        return await this.prisma.course.findMany({ where: { userId: userId } })
    }

    async getById(id: number) {
        const course = await this.prisma.course.findUnique({
            where: { id }, include: {
                courseTerms: {
                    include: {
                        term: {
                            select: {
                                name: true,
                                type: true
                            }
                        }
                    }
                },
                organization: true,
                reviews: {
                    include: {
                        user: true
                    }
                },
                user: true,
                lessons: true
            }
        })
        return { ...course, courseTerms: course?.courseTerms.map((t) => t.term) }
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

        const transaction = await this.transactions.create({ courseId: course.id, userId: user.id, type: 'PURCHASE' })
        const purchasedCourse = await this.prisma.purchasedCourse.create({
            data: {
                courseId: course.id,
                userId: userId
            }
        })

        await this.prisma.user.update({
            where: { id: userId }, data: {
                balance: {
                    decrement: course.price!
                }
            }
        })

        return Promise.all([transaction, purchasedCourse])
    }


    async createCourse(dto: CreateCourseDto, creatorId: number) {
        return this.prisma.$transaction(async (prisma) => {
            const newCourse = await prisma.course.create({
                data: {
                    title: dto.title,
                    description: dto.description,
                    userId: creatorId,
                    visibility: dto.visibility,
                    isFree: dto.isFree,
                    price: dto.price || null,
                    organizationId: dto.orgId || null,
                    level: dto.level
                }
            });

            if (dto.termIds && dto.termIds.length > 0) {
                await prisma.courseTerm.createMany({
                    data: dto.termIds.map((termId) => ({
                        termId: termId,
                        courseId: newCourse.id
                    }))
                });
            }

            if (dto.lessons && dto.lessons.length > 0) {
                for (const lesson of dto.lessons) {
                    await this.createLessonInTransaction(
                        prisma,
                        { ...lesson, courseId: newCourse.id }
                    );
                }
            }

            return await prisma.course.findUnique({
                where: { id: newCourse.id },
                include: {
                    lessons: true,
                    courseTerms: {
                        include: {
                            term: true
                        }
                    }
                }
            });
        });
    }

    private async createLessonInTransaction(
        prisma: any,
        dto: CreateLessonDto
    ) {
        const lesson = await prisma.lesson.create({
            data: {
                order: dto.order || 0,
                content: dto.content,
                goals: dto.goals,
                title: dto.title,
                courseId: dto.courseId,
                requredTime: dto.requredTime
            }
        });

        const processedContent = await this.processMediaSectionsInTransaction(
            dto.content,
            lesson.id
        );

        if (JSON.stringify(processedContent) !== JSON.stringify(dto.content)) {
            await prisma.lesson.update({
                where: { id: lesson.id },
                data: { content: processedContent }
            });
        }

        return lesson;
    }

    private async processMediaSectionsInTransaction(
        content: any,
        lessonId: number
    ): Promise<any> {
        if (!content?.sections) return content;

        const processedSections = await Promise.all(
            content.sections.map(async (section: any) => {
                if (section.type === 'media') {
                    const fileData = section.content?.file || section.file;

                    if (fileData) {
                        try {
                            let file: Express.Multer.File;

                            if (fileData.buffer) {
                                file = {
                                    buffer: fileData.buffer,
                                    originalname: fileData.originalName || fileData.originalname || 'file',
                                    mimetype: fileData.mimeType || fileData.mimetype || 'application/octet-stream',
                                    size: fileData.size || fileData.buffer.length
                                } as Express.Multer.File;
                            } else if (fileData instanceof File) {
                                const buffer = Buffer.from(await fileData.arrayBuffer());
                                file = {
                                    buffer,
                                    originalname: fileData.name,
                                    mimetype: fileData.type,
                                    size: fileData.size
                                } as Express.Multer.File;
                            } else {
                                console.warn('Unknown file format:', fileData);
                                return section;
                            }

                            // Загружаем файл в MinIO
                            const uploadResult = await this.minio.uploadLessonContent(
                                lessonId,
                                [file]
                            );

                            // Возвращаем секцию с URL
                            return {
                                ...section,
                                content: {
                                    url: uploadResult[0].url,
                                    originalName: file.originalname,
                                    mimeType: file.mimetype,
                                    size: file.size
                                }
                            };
                        } catch (error) {
                            console.error('Failed to upload media:', error);
                            // В случае ошибки возвращаем оригинальную секцию
                            return section;
                        }
                    }
                }
                return section;
            })
        );

        return { ...content, sections: processedSections };
    }

    private async createLesson(dto: CreateLessonDto) {
        const lesson = await this.prisma.lesson.create({
            data: {
                order: dto.order || 0,
                content: dto.content,
                goals: dto.goals,
                title: dto.title,
                courseId: dto.courseId,
                requredTime: dto.requredTime
            }
        });

        const processedContent = await this.processMediaSections(dto.content, lesson.id);

        if (JSON.stringify(processedContent) !== JSON.stringify(dto.content)) {
            await this.prisma.lesson.update({
                where: { id: lesson.id },
                data: { content: processedContent }
            });
        }

        return lesson;
    }

    private async processMediaSections(content: any, lessonId: number): Promise<any> {
        if (!content?.sections) return content;

        const processedSections = await Promise.all(
            content.sections.map(async (section: any) => {
                if (section.type === 'media') {
                    const fileData = section.content?.file || section.file;

                    if (fileData?.buffer) {
                        const file = {
                            buffer: fileData.buffer,
                            originalname: fileData.originalName || 'file',
                            mimetype: fileData.mimeType || 'application/octet-stream',
                            size: fileData.size
                        } as Express.Multer.File;

                        const uploadResult = await this.minio.uploadLessonContent(
                            lessonId,
                            [file]
                        );

                        return {
                            ...section,
                            content: {
                                url: uploadResult[0].url,
                                originalName: file.originalname,
                                mimeType: file.mimetype,
                                size: file.size
                            }
                        };
                    }
                }
                return section;
            })
        );

        return { ...content, sections: processedSections };
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


    async refund(courseId: number, userId: number) {

        const course = await this.getById(courseId)


        const [transaction, balance, removeFromPurchased] = await this.prisma.$transaction([
            this.prisma.transaction.create({ data: { type: 'REFUND', courseId, userId, price: course.price } }),
            this.prisma.user.update({
                where: { id: userId }, data: { balance: { increment: course.price! } }
            }),
            this.prisma.purchasedCourse.delete({
                where: {
                    userId_courseId: {
                        courseId,
                        userId
                    }
                }
            })
        ])
        return [transaction, balance, removeFromPurchased]
    }

    async gift(courseId: number, userId: number, giftToId: number) {

        const course = await this.getById(courseId)
        const [balance, transaction, newPurchased] = await this.prisma.$transaction([
            this.prisma.user.update({ where: { id: userId }, data: { balance: { decrement: course.price! } } }),
            this.prisma.transaction.create({
                data: {
                    type: 'GIFT',
                    courseId,
                    userId,
                    giftToId
                }
            }),
            this.prisma.purchasedCourse.create({ data: { courseId, userId: giftToId } })
        ])

        return [balance, transaction, newPurchased]
    }

    async publishCourse(courseId: number) {
        return await this.prisma.course.update({
            where: { id: courseId }, data: {
                visibility: 'PUBLISHED'
            }
        })
    }
}