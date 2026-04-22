import type { Course } from "../course"
import type { Lesson } from "../course/Lesson"
import type { User } from "../user"

export interface UserCourseProgress {
    id: number
    userId: number
    courseId: number
    user?: User
    goal?: Course
    currentLessonId: number | null
    currentLesson?: Lesson
    completedLessons: string | null
    completedLessonsList?: number[]
    completedLessonsCount: number
    totalLessons: number
    progress: number
    startedAt: string
    lastActivityAt: string
    completedAt: string | null
    lessons?: LessonWithProgress[]
}

export interface LessonWithProgress extends Lesson {
    isCompleted: boolean
    isCurrent: boolean
}

export interface CourseStatistics {
    totalStudents: number
    completedStudents: number
    averageProgress: number
    students: StudentProgress[]
}

export interface StudentProgress {
    user: {
        id: number
        login: string
        avatarUrl: string | null
    }
    progress: number
    completedAt: string | null
    lastActivityAt: string
}