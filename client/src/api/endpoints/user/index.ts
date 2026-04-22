export const userEndpoints = {
    upBalance: 'balance/up',
    getAll: '/users',
    getUserPayments: (id: number) => `/users/${id}/payments`,
    getUserTrasactions: (id: number) => `/users/${id}/transactions`,
    getMyHeatmap: '/user/heatmap/my',
    sendAppeal: '/appeal'
}