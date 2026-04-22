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
                lessons: {
                    orderBy: { order: 'asc' }
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

        if (!course.lessons || course.lessons.length === 0) {
            throw new BadRequestException({ message: 'Курс не содержит уроков' });
        }

        const firstLesson = course.lessons[0];
        const totalLessons = course.lessons.length;

        const progress = await this.prisma.userCourseProgress.create({
            data: {
                user: { connect: { id: userId } },
                goal: { connect: { id: courseId } },
                currentLesson: { connect: { id: firstLesson.id } },
                totalLessons,
                completedLessonsCount: 0,
                progress: 0,
                completedLessons: JSON.stringify([])
            }
        });

        return progress;
    }

    async completeLesson(lessonId: number, userId: number) {
        const lesson = await this.prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                course: {
                    include: {
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

        if (!lesson.course) {
            throw new BadRequestException({ message: 'Урок не привязан к курсу' });
        }

        const courseId = lesson.course.id;

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
        const isPreviousLesson = this.isPreviousLesson(lesson.course.lessons, lessonId, progress.currentLessonId);

        if (!isCurrentLesson && !isPreviousLesson) {
            throw new BadRequestException({
                message: 'Нельзя завершить урок, который не является текущим или предыдущим'
            });
        }

        completedLessons.push(lessonId);
        const completedLessonsCount = completedLessons.length;

        const newProgress = (completedLessonsCount / progress.totalLessons) * 100;

        const nextLesson = this.findNextLesson(lesson.course.lessons, lesson);

        const updatedProgress = await this.prisma.userCourseProgress.update({
            where: { id: progress.id },
            data: {
                completedLessons: JSON.stringify(completedLessons),
                completedLessonsCount,
                progress: newProgress,
                currentLesson: nextLesson ? { connect: { id: nextLesson.id } } : undefined,
                lastActivityAt: new Date(),
                ...(completedLessonsCount === progress.totalLessons && {
                    completedAt: new Date()
                })
            }
        });

        if (completedLessonsCount === progress.totalLessons) {
            await this.completeCourse(courseId, userId);
        }

        await this.heatmap.incrementActivity(userId);

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
                        lessons: true
                    }
                }
            }
        });

        if (!progress) {
            throw new NotFoundException({ message: 'Прогресс по курсу не найден' });
        }

        const totalLessons = progress.goal.lessons.length;

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
        await this.heatmap.incrementActivity(userId)
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
                currentLesson: true,
                goal: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        if (!progress) {
            return null;
        }

        const completedLessons = this.parseJsonArray(progress.completedLessons);

        const enrichedProgress = {
            ...progress,
            completedLessonsList: completedLessons,
            lessons: progress.goal.lessons.map(lesson => ({
                ...lesson,
                isCompleted: completedLessons.includes(lesson.id),
                isCurrent: progress.currentLessonId === lesson.id
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

    private findNextLesson(lessons: any[], currentLesson: any) {
        const currentIndex = lessons.findIndex((l: any) => l.id === currentLesson.id);

        if (currentIndex < lessons.length - 1) {
            return lessons[currentIndex + 1];
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