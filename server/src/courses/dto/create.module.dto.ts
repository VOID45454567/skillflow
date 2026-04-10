import { IsString, IsOptional, IsInt, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateLessonDto } from './create.lesson.dto';

export class CreateCourseModuleDto {
    @IsString({ message: 'Название модуля должно быть строкой' })
    title: string;

    @IsString({ message: 'Описание модуля должно быть строкой' })
    description: string;

    @IsInt({ message: 'Порядковый номер должен быть числом' })
    @Min(0, { message: 'Порядковый номер не может быть отрицательным' })
    @IsOptional()
    order?: number = 0;

    @IsArray({ message: 'Уроки должны быть массивом' })
    @ValidateNested({ each: true })
    @Type(() => CreateLessonDto)
    @IsOptional()
    lessons?: CreateLessonDto[];
}