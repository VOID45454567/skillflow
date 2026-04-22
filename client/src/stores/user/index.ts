import { API } from "@/api";
import router from "@/router";
import type { PaymentMethod } from "@/types/enums/common-info";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {

    const balanceUp = async (count: number, method: PaymentMethod) => {
        const result = await API.users.upBalance(count, method)
    }

    const getUserPayments = async (id: number) => {
        const result = await API.users.getUserPayments(id)
        return result
    }

    const sendAppeal = async (banInfoId: number, text: string) => {
        const result = await API.users.sendAppeal(banInfoId, text)
    }

    return {
        balanceUp,
        getUserPayments,
        sendAppeal
    }
})