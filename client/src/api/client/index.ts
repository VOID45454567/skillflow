import { config } from "@/conf";
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API } from "..";
import { sendFormdataInterceptor } from "../interceptors/sendFormDataInterceptor";

export const axiosApp = axios.create({
    baseURL: config.api.url,
    withCredentials: config.api.supportCredentials,
    headers: {
        'Content-Type': 'application/json'
    }
})


axiosApp.interceptors.request.use(sendFormdataInterceptor)


axiosApp.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
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
);