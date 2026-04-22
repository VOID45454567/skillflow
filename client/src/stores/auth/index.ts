import { API } from "@/api";
import router from "@/router";
import type { ILoginState, IRegisterState } from "@/types/stores/auth";
import type { User } from "@/types/user";
import type { LoginUserDto, RegisterUserDto } from "@/types/user/dto";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useUserStore } from "../user";
import { UserVerificationStatuses } from "@/types/enums/verification-statuses";

export const useAuthStore = defineStore('auth', () => {

    const registerState = ref<IRegisterState>({ email: "", login: "", password: "", validationErorrs: [], credencialsError: "" })
    const loginState = ref<ILoginState>({ email: "", password: "", validationErorrs: [], credencialsError: "" })

    const userStore = useUserStore()

    const currentUser = ref<User | undefined>(undefined)

    const isInitialized = ref(false);

    const setCurrentUser = (user: User | undefined) => {
        // console.log('setCurrentUser called with:', user)
        currentUser.value = user
        isInitialized.value = true
        if (user && user.bannedByUsers.length) {
            router.push({ name: "send-appeal" })
        }
        // console.log('isAuthenticated now:', !!currentUser.value)
    }

    const clearUser = () => {
        currentUser.value = undefined
    }

    const isAuthenticated = computed(() => !!currentUser.value)

    const login = async (dto: LoginUserDto) => {
        const response = await API.auth.login(dto)
        console.log(response?.data);

        if (!response!.success) {

            loginState.value.validationErorrs = response!.errors!
            loginState.value.credencialsError = response?.error
        }

        if (response?.success && response.data.requiresTwoFactor) {
            localStorage.setItem('2fa-userId', JSON.stringify(response.data.userId))
            router.push({ name: 'verify-2fa' })
            return
        }

        setCurrentUser(response?.data.user)

        router.push({ name: 'profile' })
    }
    const register = async (dto: RegisterUserDto) => {
        const response = await API.auth.register(dto)
        if (!response!.success) {
            registerState.value.validationErorrs = response!.errors!
            loginState.value.credencialsError = response?.error
        }
        setCurrentUser(response?.data.user)
        router.push({ name: 'profile' })
    }

    const getMe = async () => {
        const user = await API.auth.getMe()
        if (user === undefined) {
        }
        setCurrentUser(user)

        return user
    }


    const enable2fa = async () => {
        const result = await API.auth.enable2fa()
        console.log(result);
    }

    const disable2fa = async () => {
        const result = await API.auth.disable2fa()
        console.log(result);
    }

    const verify2fa = async (code: string) => {
        const userId: number = Number(localStorage.getItem('2fa-userId'))
        const result = await API.auth.verify2fa(code, userId)
        if (result?.data.success) {
            setCurrentUser(result.data.user)
            router.push({ name: 'profile' })
        }
    }

    const sendVerificationCode = async () => {
        const userId: number = Number(localStorage.getItem('2fa-userId'))
        const result = await API.auth.sendVerificationCode(userId)
    }

    const sendAccountToVerification = async () => {
        const userId = currentUser.value?.id
        const result = await API.auth.sendToVerification(String(userId))
        currentUser.value?.verificationStatus === UserVerificationStatuses.PENDING

    }

    const logout = async () => {
        await API.auth.logout()
        setCurrentUser(undefined)

        router.push({ name: 'login' })
    }

    const uploadAvatar = async (formData: FormData) => {
        await API.auth.uploadAvatar(formData)
    }

    return {
        registerState,
        loginState,
        isAuthenticated,
        currentUser,
        setCurrentUser,
        clearUser,
        login,
        register,
        logout,
        getMe,
        enable2fa,
        disable2fa,
        verify2fa,
        sendVerificationCode,
        sendAccountToVerification,
        uploadAvatar
    }
})