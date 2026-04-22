
export const userProgressEndpoints = {
    getMy: '/user-course-progress/my',
    getMyProgressOnCourse: (courseId: number) => `/user-course-progress/courses/${courseId}`,
    startNewCourse: (id: number) => `/user-course-progress/courses/${id}/start`,
    completeLesson: (id: number) => `/user-course-progress/lessons/${id}/complete`,
    completeCourse: (id: number) => `/user-course-progress/courses/${id}/start`,
    getUsersProgressStatisticOnCourse: (id: number) => `/user-course-progress/courses/${id}/statistics`,
    resetCourseProgress: (courseId: number) => `/user-course-progress/courses/${courseId}/reset`
}