import { useRouter } from 'vue-router';

export const useErrorNavigation = () => {
    const router = useRouter();

    const navigateToError = (code: string | number, message?: string) => {
        router.push({
            name: 'error',
            query: {
                code: String(code),
                ...(message && { message })
            }
        });
    };

    const showNotFound = (message?: string) => {
        navigateToError(404, message || 'Страница не найдена');
    };

    const showUnauthorized = (message?: string) => {
        navigateToError(401, message || 'Необходима авторизация');
    };

    const showForbidden = (message?: string) => {
        navigateToError(403, message || 'Доступ запрещен');
    };

    const showServerError = (message?: string) => {
        navigateToError(500, message || 'Внутренняя ошибка сервера');
    };

    return {
        navigateToError,
        showNotFound,
        showUnauthorized,
        showForbidden,
        showServerError
    };
};