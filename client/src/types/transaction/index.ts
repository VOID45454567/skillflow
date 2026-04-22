import type { Course } from "../course"
import type { TransactionType } from "../enums/common-info";
import type { User } from "../user"

export interface Transaction {
    id: number;
    price: number;
    type: TransactionType;
    createdAt: string;
    userId: number;
    user: User
    courseId: number,
    course: Course
    giftUser: User,
    giftTo: number
    description?: string;
}