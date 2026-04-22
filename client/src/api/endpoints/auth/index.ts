export const authEndpoints = {
    login: 'auth/login',
    register: 'auth/register',
    verify2fa: 'auth/verify-2fa',
    logout: 'auth/logout',
    getMe: 'auth/me',
    enable2fa: 'auth/2fa/enable',
    disable2fa: 'auth/2fa/disable',
    refreshTokens: 'auth/refresh',
    sendToVerification: (id: string) => `auth/verif/send/${id}`,
    uploadAvatar: 'auth/avatar/upload',
    sendVerificationCode: 'auth/2fa/send-code'
}