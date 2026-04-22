import { PaymentMethod } from "../../../prisma/generated/prisma"

export class UpBalanceDto {
    count: number
    method: PaymentMethod
    userId?: number
}