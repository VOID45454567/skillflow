import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HeatmapService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async create(userId: number) {
        return await this.prisma.heatmapData.create({ data: { userId } })
    }

    async incrementActivity(userId: number) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        return await this.prisma.heatmapData.upsert({
            where: {
                userId_date: {
                    userId: userId,
                    date: today,
                }
            },
            update: {
                actionsCount: { increment: 1 }
            },
            create: {
                actionsCount: 0,
                date: today,
                userId: userId
            }
        })
    }

    async getByUserId(userId: number, startDate: Date, endDate: Date) {
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const activities = await this.prisma.heatmapData.findMany({
            where: {
                userId: userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        });

        const activityMap = new Map();
        activities.forEach(activity => {
            const dateKey = activity.date.toISOString().split('T')[0];
            activityMap.set(dateKey, activity.actionsCount);
        });

        const result = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const dateKey = currentDate.toISOString().split('T')[0];
            const actionsCount = activityMap.get(dateKey) || 0;

            result.push({
                date: new Date(currentDate),
                actionsCount: actionsCount,
                level: this.getActivityLevel(actionsCount)
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    }

    private getActivityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
        if (count === 0) return 0;
        if (count < 3) return 1;
        if (count < 6) return 2;
        if (count < 10) return 3;
        return 4;
    }
}
