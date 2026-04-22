import type { InternalAxiosRequestConfig } from "axios";

export const sendFormdataInterceptor = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (config.data instanceof FormData) {
        config.headers['Content-Type'] = 'multipart/form-data'
    }
    return config
}