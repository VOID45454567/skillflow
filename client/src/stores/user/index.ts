// stores/user/index.ts
import { API } from "@/api";
import type { PaymentMethod } from "@/types/enums/common-info";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
    const users = ref<User[]>([]);

    const balanceUp = async (count: number, method: PaymentMethod) => {
        const result = await API.users.upBalance(count, method)
        return result
    }

    const getUserPayments = async (id: number) => {
        const result = await API.users.getUserPayments(id)
        return result
    }

    const sendAppeal = async (banInfoId: number, text: string) => {
        const result = await API.users.sendAppeal(banInfoId, text)
        return result
    }

    const getAll = async () => {
        try {
            const result = await API.users.getAll()
            if (Array.isArray(result)) {
                users.value = result
            } else if (result && Array.isArray(result.data)) {
                users.value = result.data
            }
            return users.value
        } catch (error) {
            console.error('Ошибка получения пользователей:', error)
            return []
        }
    }

    return {
        users,
        balanceUp,
        getUserPayments,
        sendAppeal,
        getAll,
    }
})