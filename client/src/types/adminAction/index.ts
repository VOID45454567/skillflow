import { AdminActionTypes } from "../enums/admin-action-types";
import type { User } from "../user";

export interface AdminAction {
    id: number,
    userId: number,
    admin: User,
    targetUserId: number,
    actionType: AdminActionTypes

    createdAt: string
    reason: string
}