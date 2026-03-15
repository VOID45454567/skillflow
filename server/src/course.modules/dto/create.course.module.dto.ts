import { CreateLessonDto } from "src/lessons/dto/create.lesson.dto"

export class CreateCourseModuleDto {
    title: string
    description: string
    previewUrl?: string
    order: number
    lessons?: CreateLessonDto[]
}