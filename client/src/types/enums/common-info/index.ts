import type { Term } from "@/types/course/course-term";

export enum PaymentMethod {
    CARD = "CARD",
    SBP = "SBP",
}

export enum TransactionType {
    PURCHASE = "PURCHASE",
    REFUND = "REFUND",
    GIFT = "GIFT",
}

export enum TermType {
    CATEGORY = "CATEGORY",
    TAG = "TAG",
}

export interface CreateTermDto {
    name: string,
    type: Term
}
