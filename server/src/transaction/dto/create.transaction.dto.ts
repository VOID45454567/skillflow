import { TransactionType } from "../../../prisma/generated/prisma"

export class CreateTransactionDto {
    courseId: number
    userId: number
    type: TransactionType
}