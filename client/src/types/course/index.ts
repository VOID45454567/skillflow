import type { CourseLevels } from "../enums/course-levels";
import type { CourseVisibilityTypes } from "../enums/course-visibility-types";
import type { Organization } from "../Organization";
import type { Review } from "../review";
import type { User } from "../user";
import type { UserCourseProgress } from "../userCourseProgress";
import type { CourseTerm } from "./course-term";
import type { Lesson } from "./Lesson";

export interface Course {
    id: number,
    title: string,
    description: string,
    userId: number,
    user?: User
    lessons: Lesson[]
    level: CourseLevels
    isFree: boolean,
    price: number,
    visibility: CourseVisibilityTypes,
    createdAt: string,
    updatedAt: string,
    courseTerms: CourseTerm[],
    reviews: Review[]
    organisationId?: number,
    organization?: Organization
    userCourseProgresses: UserCourseProgress[]
}

export interface CourseCardData {
    id: number
    title: string
    description: string
    level: CourseLevels
    studentsCount: number
    duration: number
    colorGradient: {
        from: string
        to: string
    }
    isFree: boolean
    price: number
}

