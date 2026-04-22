export const organizationEndpoints = {
    create: '/organization',
    invite: '/organization/invite',
    getAll: '/organization',
    getById: (id: number) => `/organization/${id}`,
    uploadLogo: (orgId: number) => `/organization/logo/upload/${orgId}`,
    uploadGallery: (orgId: number) => `/organization/${orgId}/gallery/upload`,
    removeFromGallery: (orgId: number) => `/organization/${orgId}/gallery/remove`,
    createCourseFromOrg: (orgId: number) => `/organization/create-course/${orgId}`,
    addmember: (orgId: number) => `/organization/add-member/${orgId}`,
    removeMember: (orgId: number) => `/organization/remove-member/${orgId}`
}