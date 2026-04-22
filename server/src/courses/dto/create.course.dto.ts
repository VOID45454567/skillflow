
import { IsString, IsBoolean, IsOptional, IsInt, Min, Max, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { VisibilityTypes } from '../../../prisma/generated/prisma';
import { CreateLessonDto } from './create.lesson.dto';
import { CourseLevels } from '../../../prisma/generated/prisma';

export class CreateCourseDto {
    @IsString({ message: 'Название должно быть строкой' })
    title: string;

    @IsString({ message: 'Описание должно быть строкой' })
    description: string;

    @IsBoolean({ message: 'isFree должно быть булевым значением' })
    @IsOptional()
    isFree?: boolean = true;

    @IsEnum(CourseLevels)
    level: CourseLevels

    @IsInt({ message: 'Цена должна быть числом' })
    @Min(0, { message: 'Цена не может быть отрицательной' })
    @Max(100000, { message: 'Цена не может превышать 100000' })
    @IsOptional()
    price?: number;

    @IsArray()
    @IsInt({ each: true })
    termIds: number[];

    @IsArray({ message: 'Уроки должны быть массивом' })
    @ValidateNested({ each: true })
    @Type(() => CreateLessonDto)
    @IsOptional()
    lessons?: CreateLessonDto[];

    @IsEnum(VisibilityTypes, { message: 'Может быть общим либо от организации' })
    visibility: VisibilityTypes


    @IsInt({ message: 'ID организации' })
    @IsOptional()
    orgId: number
}