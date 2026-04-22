import type { Appeal } from "../appeal";
import type { User } from "../user";

export interface BlockInfo {
    id: number;
    blockReason: string;
    bannedId: number;
    bannedBy: number;
    bannedUser?: User;
    bannedByUser?: User;
    createdAt: string;
    updatedAt: string;
    userId?: number;
    appealId?: number;
    appeal?: Appeal;
}