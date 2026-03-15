import { IsNotEmpty } from "class-validator"
import { CreateCourseModuleDto } from "src/course.modules/dto/create.course.module.dto"
import { CourseLevel, CourseType } from "src/generated/prisma/enums"

export class CreateCourseDto {
    @IsNotEmpty({ message: 'Обязательное поле' })
    title: string
    description: string
    previewUrl?: string
    level: CourseLevel
    type: CourseType
    price?: number
    organizationId?: number
    modules?: CreateCourseModuleDto[]
    categories: number[]
    tags: number[]
}