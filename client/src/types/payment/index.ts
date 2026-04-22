import type { PaymentMethod } from "../enums/common-info";
import type { User } from "../user"

export interface Payment {
    id: number;
    count: number;
    createdAt: string;
    user: User
    userId: number;
    method: PaymentMethod;
}