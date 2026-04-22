import type { BlockInfo } from "../blockInfo";
import type { User } from "../user";

export interface Appeal {
    id: number;
    userId: number;
    user?: User;
    text: string;
    banInfoId: number;
    banInfo?: BlockInfo;
    createdAt: string;
    updatedAt: string;
}