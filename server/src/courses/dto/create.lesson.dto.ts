import { IsString, IsInt, Min, IsArray, IsObject, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateLessonDto {
    @IsInt({ message: 'Порядковый номер должен быть числом' })
    @Min(0, { message: 'Порядковый номер не может быть отрицательным' })
    @IsOptional()
    order?: number = 0;

    title: string

    @IsArray({ message: 'Цели должны быть массивом' })
    @ArrayMinSize(1, { message: 'Должна быть хотя бы одна цель' })
    @IsString({ each: true, message: 'Каждая цель должна быть строкой' })
    goals: string[];

    @IsObject({ message: 'Контент должен быть объектом' })
    content: {
        sections: Array<{
            type: 'text' | 'objectives' | 'code' | 'media';
            content: any;
        }>;
    };
}