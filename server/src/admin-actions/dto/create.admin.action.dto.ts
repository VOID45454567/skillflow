import { ActionsTypes } from "../../../prisma/generated/prisma"

export class CreateAdminActionDto {
    targetUser: number
    actionType: ActionsTypes
    reason: string
}