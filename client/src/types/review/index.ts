import type { Course } from "../course"
import type { User } from "../user"

export interface Review {
    id: number
    userId: number
    courseId: number

    user: User,
    course: Course

    text: string

    createdAt: string
}