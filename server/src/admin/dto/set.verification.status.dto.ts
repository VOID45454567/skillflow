import { IsEnum, IsString } from "class-validator"
import { ActionsTypes, UserVerificationStatuses } from "../../../prisma/generated/prisma"

export class SetVerificationStatusDto {

    @IsString({ message: 'Причина обязательна' })
    reason: string

    @IsEnum(ActionsTypes, { message: 'Некорректное действие' })
    actionType: ActionsTypes

    @IsEnum(UserVerificationStatuses, { message: 'Некоректный новый статус' })
    newStatus: UserVerificationStatuses
}