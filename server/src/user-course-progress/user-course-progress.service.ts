import { HeatmapService } from '@/heatmap/heatmap.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserCourseProgressService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly heatmap: HeatmapService
    ) { }

    async startCourse(courseId: number, userId: number) {
        const course = await this.prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { id: 'asc' }
                }
            }
        });

        if (!course) {
            throw new NotFoundException({ message: 'Курс не найден' });
        }

        await this.checkCourseAccess(course, userId);

        const existingProgress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (existingProgress) {
            return existingProgress;
        }

        const firstModule = course.modules[0];
        if (!firstModule) {
            throw new BadRequestException({ message: 'Курс не содержит модулей' });
        }

        const firstLesson = firstModule.lessons[0];
        if (!firstLesson) {
            throw new BadRequestException({ message: 'Модуль не содержит уроков' });
        }

        const totalLessons = course.modules.reduce(
            (acc, module) => acc + module.lessons.length,
            0
        );

        const progress = await this.prisma.userCourseProgress.create({
            data: {
                user: { connect: { id: userId } },
                goal: { connect: { id: courseId } },
                currentModule: { connect: { id: firstModule.id } },
                currentLesson: { connect: { id: firstLesson.id } },
                totalLessons,
                completedLessonsCount: 0,
                progress: 0,
                completedLessons: JSON.stringify([]),
                completedModules: JSON.stringify([])
            }
        });

        return progress;
    }

    async completeLesson(lessonId: number, userId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                courseModule: {
                    include: {
                        course: true,
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            throw new NotFoundException({ message: 'Урок не найден' });
        }

        const module = lesson.courseModule;
        if (!module || !module.course) {
            throw new BadRequestException({ message: 'Урок не привязан к курсу' });
        }

        const courseId = module.course.id;

        let progress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!progress) {
            progress = await this.startCourse(courseId, userId);
        }

        const completedLessons = this.parseJsonArray(progress.completedLessons);
        if (completedLessons.includes(lessonId)) {
            return {
                ...progress,
                message: 'Урок уже был завершен ранее'
            };
        }

        const isCurrentLesson = progress.currentLessonId === lessonId;
        const isPreviousLesson = this.isPreviousLesson(module.lessons, lessonId, progress.currentLessonId);

        if (!isCurrentLesson && !isPreviousLesson) {
            throw new BadRequestException({
                message: 'Нельзя завершить урок, который не является текущим или предыдущим'
            });
        }

        completedLessons.push(lessonId);
        const completedLessonsCount = completedLessons.length;

        const newProgress = (completedLessonsCount / progress.totalLessons) * 100;

        const nextLesson = this.findNextLesson(module, lesson, progress);

        const updatedProgress = await this.prisma.userCourseProgress.update({
            where: { id: progress.id },
            data: {
                completedLessons: JSON.stringify(completedLessons),
                completedLessonsCount,
                progress: newProgress,
                currentLesson: nextLesson ? { connect: { id: nextLesson.id } } : undefined,
                currentModule: nextLesson?.courseModuleId !== progress.currentModuleId && nextLesson
                    ? { connect: { id: nextLesson.courseModuleId! } }
                    : undefined,
                lastActivityAt: new Date(),
                ...(completedLessonsCount === progress.totalLessons && {
                    completedAt: new Date()
                })
            }
        });

        if (completedLessonsCount === progress.totalLessons) {
            await this.completeCourse(courseId, userId);
        }



        return updatedProgress;
    }

    async completeModule(moduleId: number, userId: number) {
        const module = await this.prisma.courseModule.findUnique({
            where: { id: moduleId },
            include: {
                course: true,
                lessons: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!module || !module.course) {
            throw new NotFoundException({ message: 'Модуль не найден' });
        }

        let progress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId: module.course.id
                }
            }
        });

        if (!progress) {
            progress = await this.startCourse(module.course.id, userId);
        }

        const completedModules = this.parseJsonArray(progress.completedModules);
        if (completedModules.includes(moduleId)) {
            return {
                ...progress,
                message: 'Модуль уже был завершен ранее'
            };
        }

        const completedLessons = this.parseJsonArray(progress.completedLessons);
        let newLessonsCompleted = 0;

        for (const lesson of module.lessons) {
            if (!completedLessons.includes(lesson.id)) {
                completedLessons.push(lesson.id);
                newLessonsCompleted++;
            }
        }

        completedModules.push(moduleId);

        const completedLessonsCount = completedLessons.length;
        const newProgress = (completedLessonsCount / progress.totalLessons) * 100;

        const nextModule = await this.findNextModule(module.course.id, moduleId);
        const nextLesson = nextModule ? nextModule.lessons[0] : null;

        const updatedProgress = await this.prisma.userCourseProgress.update({
            where: { id: progress.id },
            data: {
                completedLessons: JSON.stringify(completedLessons),
                completedModules: JSON.stringify(completedModules),
                completedLessonsCount,
                progress: newProgress,
                currentModule: nextModule ? { connect: { id: nextModule.id } } : undefined,
                currentLesson: nextLesson ? { connect: { id: nextLesson.id } } : undefined,
                lastActivityAt: new Date(),
                ...(completedLessonsCount === progress.totalLessons && {
                    completedAt: new Date()
                })
            }
        });

        if (completedLessonsCount === progress.totalLessons) {
            await this.completeCourse(module.course.id, userId);
        }

        await this.heatmap.incrementActivity(userId)

        return updatedProgress;
    }

    async completeCourse(courseId: number, userId: number) {
        const progress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            include: {
                goal: {
                    include: {
                        modules: {
                            include: {
                                lessons: true
                            }
                        }
                    }
                }
            }
        });

        if (!progress) {
            throw new NotFoundException({ message: 'Прогресс по курсу не найден' });
        }

        const totalLessons = progress.goal.modules.reduce(
            (acc, module) => acc + module.lessons.length,
            0
        );

        if (progress.completedLessonsCount < totalLessons) {
            throw new BadRequestException({
                message: 'Не все уроки курса завершены',
                completed: progress.completedLessonsCount,
                total: totalLessons
            });
        }

        const updatedProgress = await this.prisma.userCourseProgress.update({
            where: { id: progress.id },
            data: {
                progress: 100,
                completedAt: new Date()
            }
        });

        return {
            ...updatedProgress,
            message: 'Курс успешно завершен!'
        };
    }

    async getUserCourseProgress(userId: number, courseId: number) {
        const progress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            },
            include: {
                currentModule: true,
                currentLesson: true,
                goal: {
                    include: {
                        modules: {
                            include: {
                                lessons: {
                                    orderBy: { order: 'asc' }
                                }
                            },
                            orderBy: { id: 'asc' }
                        }
                    }
                }
            }
        });

        if (!progress) {
            return null;
        }

        const completedLessons = this.parseJsonArray(progress.completedLessons);
        const completedModules = this.parseJsonArray(progress.completedModules);

        const enrichedProgress = {
            ...progress,
            completedLessonsList: completedLessons,
            completedModulesList: completedModules,
            modules: progress.goal.modules.map(module => ({
                ...module,
                isCompleted: completedModules.includes(module.id),
                lessons: module.lessons.map(lesson => ({
                    ...lesson,
                    isCompleted: completedLessons.includes(lesson.id),
                    isCurrent: progress.currentLessonId === lesson.id
                }))
            }))
        };

        return enrichedProgress;
    }

    async getAllUserProgresses(userId: number) {
        const progresses = await this.prisma.userCourseProgress.findMany({
            where: { userId },
            include: {
                goal: {
                    select: {
                        id: true,
                        title: true,
                        description: true
                    }
                },
                currentModule: {
                    select: {
                        id: true,
                        title: true
                    }
                },
                currentLesson: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                lastActivityAt: 'desc'
            }
        });

        return progresses;
    }

    async resetCourseProgress(courseId: number, userId: number) {
        const progress = await this.prisma.userCourseProgress.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId
                }
            }
        });

        if (!progress) {
            throw new NotFoundException({ message: 'Прогресс не найден' });
        }

        await this.prisma.userCourseProgress.delete({
            where: { id: progress.id }
        });

        return await this.startCourse(courseId, userId);
    }

    private parseJsonArray(json: any): number[] {
        if (!json) return [];
        try {
            return typeof json === 'string' ? JSON.parse(json) : json;
        } catch {
            return [];
        }
    }

    private async checkCourseAccess(course: any, userId: number) {
        if (course.isFree) {
            return true;
        }

        const purchased = await this.prisma.purchasedCourse.findFirst({
            where: {
                courseId: course.id,
                userId
            }
        });

        if (purchased) {
            return true;
        }

        if (course.userId === userId) {
            return true;
        }

        if (course.organizationId) {
            const isMember = await this.prisma.organizationMember.findFirst({
                where: {
                    organizationId: course.organizationId,
                    userId
                }
            });

            if (isMember) {
                return true;
            }
        }

        throw new ForbiddenException({
            message: 'У вас нет доступа к этому курсу. Курс необходимо приобрести.'
        });
    }

    private isPreviousLesson(lessons: any[], lessonId: number, currentLessonId: number): boolean {
        const lessonIndex = lessons.findIndex(l => l.id === lessonId);
        const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
        return lessonIndex < currentIndex;
    }

    private findNextLesson(currentModule: any, currentLesson: any, progress: any) {
        const lessons = currentModule.lessons;
        const currentIndex = lessons.findIndex((l: any) => l.id === currentLesson.id);

        if (currentIndex < lessons.length - 1) {
            return lessons[currentIndex + 1];
        }

        return null;
    }

    private async findNextModule(courseId: number, currentModuleId: number) {
        const modules = await this.prisma.courseModule.findMany({
            where: { courseId },
            include: {
                lessons: {
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { id: 'asc' }
        });

        const currentIndex = modules.findIndex(m => m.id === currentModuleId);

        if (currentIndex < modules.length - 1) {
            return modules[currentIndex + 1];
        }

        return null;
    }

    async getCourseStatistics(courseId: number) {
        const progresses = await this.prisma.userCourseProgress.findMany({
            where: { courseId },
            include: {
                user: {
                    select: {
                        id: true,
                        login: true,
                        avatarUrl: true
                    }
                }
            }
        });

        const totalStudents = progresses.length;
        const completedStudents = progresses.filter(p => p.completedAt).length;
        const averageProgress = totalStudents > 0
            ? progresses.reduce((acc, p) => acc + p.progress, 0) / totalStudents
            : 0;

        return {
            totalStudents,
            completedStudents,
            averageProgress,
            completionRate: totalStudents > 0 ? (completedStudents / totalStudents) * 100 : 0,
            students: progresses.map(p => ({
                user: p.user,
                progress: p.progress,
                completedAt: p.completedAt,
                lastActivityAt: p.lastActivityAt
            }))
        };
    }
}