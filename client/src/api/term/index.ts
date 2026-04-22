import type { Axios } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { CourseTerm } from "@/types/course/course-term";

export class termsApi {
    constructor(
        private readonly axios: Axios
    ) { }

    async getCategories() {
        try {
            const request = await this.axios.get(ENDPOINTS.terms.getCategories)
            return request.data as CourseTerm[]
        } catch (error) {
            console.log(error);

        }
    }

    async getTags() {
        try {
            const request = await this.axios.get(ENDPOINTS.terms.getTags)
            return request.data as CourseTerm[]
        } catch (error) {
            console.log(error);

        }
    }

}