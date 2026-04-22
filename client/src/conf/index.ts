const env = import.meta.env

export const config = {
    api: {
        url: env.VITE_API_URL,
        supportCredentials: true
    }
}