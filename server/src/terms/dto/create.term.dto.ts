import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TermTypes } from '../../../prisma/generated/prisma';

export class CreateTermDto {
    @IsString({ message: 'Название должно быть строкой' })
    name: string

    @IsNotEmpty({ message: 'Поле обязательно' })
    @IsEnum(TermTypes, { message: 'Некорректый тип' })
    type: TermTypes
}