import type { Axios } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { CourseStatistics, UserCourseProgress } from "@/types/userCourseProgress";

export class userProgressApi {
    constructor(private axios: Axios) { }

    async getMyProgress() {
        const request = await this.axios.get(ENDPOINTS.userCourseProgress.getMy)
        return request.data as UserCourseProgress[]
    }

    async getCourseProgress(courseId: number) {
        const request = await this.axios.get(ENDPOINTS.userCourseProgress.getMyProgressOnCourse(courseId))
        return request.data as UserCourseProgress
    }

    async startNewCourse(courseId: number) {
        const request = await this.axios.post(ENDPOINTS.userCourseProgress.startNewCourse(courseId))
        return request.data
    }

    async resetCourseProgress(courseId: number) {
        const request = await this.axios.delete(ENDPOINTS.userCourseProgress.resetCourseProgress(courseId))
        return request.data
    }

    async completeLesson(lessonId: number) {
        const request = await this.axios.post(ENDPOINTS.userCourseProgress.completeLesson(lessonId))
        return request.data
    }

    async completeCourse(courseId: number) {
        const request = await this.axios.post(ENDPOINTS.userCourseProgress.completeCourse(courseId))
        return request.data
    }

    async getUsersProgressStatisticOnCourse(courseId: number) {
        const request = await this.axios.get(ENDPOINTS.userCourseProgress.getUsersProgressStatisticOnCourse(courseId))
        return request.data
    }
}