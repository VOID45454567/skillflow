import type { User } from "..";

export interface Heatmap {
    id: number,
    userId: number,
    user: User,
    actionsCount: number,
    date: string
}