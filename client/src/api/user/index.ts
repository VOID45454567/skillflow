import type { Axios } from "axios";
import { ENDPOINTS } from "../endpoints";
import type { PaymentMethod } from "@/types/enums/common-info";
import type { User } from "@/types/user";
import type { Heatmap } from "@/types/user/heatmap";
import type { Appeal } from "@/types/appeal";

export class userApi {
    constructor(
        private axios: Axios
    ) { }
    async getAll() {
        try {
            const request = await this.axios.get(ENDPOINTS.user.getAll)
            return request.data as User[]
        } catch (error) {
            console.log(error);
        }
    }

    async getHeatmapById() {
        try {
            const request = await this.axios.get(ENDPOINTS.user.getMyHeatmap)
            return request.data as Heatmap[]
        } catch (error) {
            console.log(error);
        }
    }
    async upBalance(count: number, method: PaymentMethod) {
        try {
            const request = await this.axios.patch(ENDPOINTS.user.upBalance, { count, method })
            return request
        } catch (error) {
            console.log(error);
        }
    }

    async getUserPayments(id: number) {
        try {
            const request = await this.axios.get(ENDPOINTS.user.getUserPayments(id))
            return request.data
        } catch (error) {
            console.log(error);
        }
    }

    async getUserTransactions(id: number) {
        try {
            const request = await this.axios.get(ENDPOINTS.user.getUserTrasactions(id))
            return request.data
        } catch (error) {
            console.log(error);
        }
    }

    async sendAppeal(banId: number, text: string) {
        const request = await this.axios.post(ENDPOINTS.user.sendAppeal, { banInfoId: banId, text })
        return request.data as Appeal
    }
}