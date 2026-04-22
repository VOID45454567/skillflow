export const coursesEdpoints = {
    byId: (id: number) => `/courses/${id}`,
    all: '/courses',
    my: '/courses/my',
    purchased: '/courses/purchased',
    makePaid: (id: number) => `/courses/${id}/make-paid`,
    create: '/courses',
    buy: (id: number) => `/courses/${id}/buy`,
    gift: (courseId: number, userId: number) => `/courses/${userId}/gift/${courseId}`,
    refund: (courseId: number) => `/courses/refund/${courseId}`,
    makeReview: (courseId: number) => `/review/${courseId}`,
    publish: (courseId: number) => `/courses/${courseId}/publish`
}