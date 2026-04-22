import type { AxiosError, AxiosInstance } from "axios";
import { API } from "..";

export const authResponceIntrceptor = async (error: AxiosError, axiosApp: AxiosInstance): Promise<any> => {
    const originalRequest = error.config as any;

    if (
        error.response?.status === 401 &&
        error.response?.data?.message === 'Неавторизованный доступ' &&
        !originalRequest._retry
    ) {
        originalRequest._retry = true;

        try {
            await API.auth.regenerateTokens();
            console.log('перегенерация токенов');

            return axiosApp(originalRequest);
        } catch (refreshError) {
            window.location.href = '/login';
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
}
