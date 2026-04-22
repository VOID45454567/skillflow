import type { LoginUserDto, RegisterUserDto } from "@/types/user/dto";
import type { Axios, AxiosError } from "axios";
import { ENDPOINTS } from "../endpoints";
import { processValidationError } from "@/utils/processValidationError";
import type { User } from "@/types/user";

export class authApi {
    constructor(
        private axios: Axios,
    ) { }

    async register(dto: RegisterUserDto) {
        try {
            const { data } = await this.axios.post(ENDPOINTS.auth.register, dto)
            return { success: true, data }
        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.status === 422) {
                const errors = processValidationError(axiosError)
                return { success: false, errors }
            }

            if (axiosError.status === 400) {
                const error = axiosError.response?.data!.message
                return { success: false, error }
            }

        }
    }

    async login(dto: LoginUserDto) {
        try {
            const { data } = await this.axios.post(ENDPOINTS.auth.login, dto)
            return { success: true, data }
        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.status === 422) {
                const errors = processValidationError(axiosError)
                return { success: false, errors }
            }

            if (axiosError.status === 400) {
                const error = axiosError.response?.data!.message
                return { success: false, error }
            }

        }
    }

    async getMe() {
        try {
            const request = await this.axios.get(ENDPOINTS.auth.getMe)

            return request.data as User | undefined
        } catch (error) {
            console.log(error);
        }
    }


    async regenerateTokens() {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.refreshTokens)
            return request
        } catch (error) {
            console.log(error);

        }
    }

    async enable2fa() {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.enable2fa)
            return request
        } catch (error) {
            console.log(error);
        }
    }


    async verify2fa(code: string, userId: number) {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.verify2fa, { code, userId })
            return request
        } catch (error) {
            console.log(error);

        }
    }

    async sendVerificationCode(userId: number) {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.sendVerificationCode, { userId })
            return request
        } catch (error) {
            console.log(error);

        }
    }

    async sendToVerification(userId: string) {
        try {
            const request = await this.axios.patch(ENDPOINTS.auth.sendToVerification(userId))
            return request
        } catch (error) {
            console.log(error);
        }
    }

    async disable2fa() {
        try {
            const request = await this.axios.delete(ENDPOINTS.auth.disable2fa)
            return request
        } catch (error) {
            console.log(error);

        }
    }

    async logout() {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.logout)
            return request
        } catch (error) {
            console.log(error);
        }
    }

    async uploadAvatar(data: FormData) {
        try {
            const request = await this.axios.post(ENDPOINTS.auth.uploadAvatar, data)
            return request
        } catch (error) {
            console.log(error);

        }
    }
}