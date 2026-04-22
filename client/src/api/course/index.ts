import type { Axios, AxiosError } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { Course } from "@/types/course";

export class coursesApi {
    constructor(
        private axios: Axios
    ) { }

    async getAll() {
        try {
            const request = await this.axios.get(ENDPOINTS.courses.all)
            return request.data as Course[]
        } catch (error) {
            return error as AxiosError
        }
    }

    async getById(id: number) {
        try {
            const request = await this.axios.get(ENDPOINTS.courses.byId(id))
            console.log(request);

            return request.data as Course
        } catch (error) {
            return error as AxiosError

        }
    }

    async getMy() {
        try {
            const request = await this.axios.get(ENDPOINTS.courses.my)
        } catch (error) {
            return error as AxiosError
        }
    }

    async getPurchased() {
        try {
            const request = await this.axios.get(ENDPOINTS.courses.purchased)
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async makePaid(courseId: number, count: number) {
        try {
            const request = await this.axios.patch(ENDPOINTS.courses.makePaid(courseId), { price: count })
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async buyCourse(courseId: number) {
        try {
            const request = await this.axios.post(ENDPOINTS.courses.buy(courseId))
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async create(formData: FormData, orgId?: number): Promise<any> {
        const endpoint = orgId
            ? ENDPOINTS.organization.createCourseFromOrg(orgId)
            : ENDPOINTS.courses.create;

        const response = await this.axios.post(endpoint, formData);
        return response;
    }

    async gift(courseId: number, giftToId: number) {
        try {
            const request = await this.axios.post(ENDPOINTS.courses.gift(courseId, giftToId))
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async refund(courseId: number) {
        try {
            const request = await this.axios.post(ENDPOINTS.courses.refund(courseId))
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async makeReview(courseId: number, text: string) {
        try {
            const request = await this.axios.post(ENDPOINTS.courses.makeReview(courseId), { text })
            return request
        } catch (error) {
            return error as AxiosError
        }
    }

    async publishCourse(courseId: number) {
        try {
            const request = await this.axios.patch(ENDPOINTS.courses.publish(courseId))
            return request
        } catch (error) {
            return error as AxiosError
        }
    }
}