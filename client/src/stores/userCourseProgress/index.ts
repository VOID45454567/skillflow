import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { API } from "@/api";
import type { CourseStatistics, UserCourseProgress } from "@/types/userCourseProgress";

export const useUserCourseProgressStore = defineStore('userProgress', () => {
    const currentProgress = ref<UserCourseProgress | null>(null)
    const allProgresses = ref<UserCourseProgress[]>([])
    const courseStatistics = ref<CourseStatistics | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const activeCourses = computed(() =>
        allProgresses.value.filter(p => p.progress > 0 && p.progress < 100)
    )

    const completedCourses = computed(() =>
        allProgresses.value.filter(p => p.progress === 100)
    )

    const getCourseProgress = (courseId: number) =>
        allProgresses.value.find(p => p.courseId === courseId)

    // Парсим completedLessons из JSON строки
    function parseCompletedLessons(progress: UserCourseProgress): number[] {
        if (!progress.completedLessons) return []
        try {
            return typeof progress.completedLessons === 'string'
                ? JSON.parse(progress.completedLessons)
                : progress.completedLessons
        } catch {
            return []
        }
    }

    // Обогащаем прогресс данными об уроках
    function enrichProgress(progress: UserCourseProgress): UserCourseProgress {
        const completedLessonsList = parseCompletedLessons(progress)
        const lessons = progress.goal?.lessons?.map(lesson => ({
            ...lesson,
            isCompleted: completedLessonsList.includes(lesson.id),
            isCurrent: progress.currentLessonId === lesson.id
        })) || []

        return {
            ...progress,
            completedLessonsList,
            lessons
        }
    }

    async function fetchMyProgress() {
        isLoading.value = true
        error.value = null
        try {
            const data = await API.userProgress.getMyProgress()
            if (data) {
                // Обогащаем каждый прогресс
                allProgresses.value = data.map(p => enrichProgress(p))
            }
            return data
        } catch (err) {
            error.value = 'Ошибка при загрузке прогресса'
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    async function resetCourseProgress(courseId: number) {
        isLoading.value = true
        error.value = null
        try {
            await API.userProgress.resetCourseProgress(courseId)
            await fetchMyProgress()
            return currentProgress.value
        } catch (err) {
            error.value = 'Ошибка при сбросе прогресса'
            console.error(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchCourseProgress(courseId: number) {
        isLoading.value = true
        error.value = null
        try {
            const data = await API.userProgress.getCourseProgress(courseId)
            if (data) {
                const enriched = enrichProgress(data)
                const index = allProgresses.value.findIndex(p => p.courseId === courseId)
                if (index !== -1) {
                    allProgresses.value[index] = enriched
                } else {
                    allProgresses.value.push(enriched)
                }
                currentProgress.value = enriched
            }
            return data
        } catch (err) {
            error.value = 'Ошибка при загрузке прогресса курса'
            console.error(err)
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function startCourse(courseId: number) {
        isLoading.value = true
        error.value = null
        try {
            await API.userProgress.startNewCourse(courseId)
            const progress = await fetchCourseProgress(courseId)
            return progress
        } catch (err) {
            error.value = 'Ошибка при начале курса'
            console.error(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function completeLesson(lessonId: number) {
        isLoading.value = true
        error.value = null
        try {
            await API.userProgress.completeLesson(lessonId)
            await fetchMyProgress()
            return currentProgress.value
        } catch (err) {
            error.value = 'Ошибка при завершении урока'
            console.error(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function completeCourse(courseId: number) {
        isLoading.value = true
        error.value = null
        try {
            await API.userProgress.completeCourse(courseId)
            await fetchMyProgress()
            return currentProgress.value
        } catch (err) {
            error.value = 'Ошибка при завершении курса'
            console.error(err)
            throw err
        } finally {
            isLoading.value = false
        }
    }

    async function fetchCourseStatistics(courseId: number) {
        isLoading.value = true
        error.value = null
        try {
            const data = await API.userProgress.getUsersProgressStatisticOnCourse(courseId)
            if (data) {
                const progresses = data as CourseStatistics
                const totalStudents = progresses.students.length
                const completedStudents = progresses.completedStudents
                const averageProgress = progresses.averageProgress

                courseStatistics.value = {
                    totalStudents,
                    completedStudents,
                    averageProgress,
                    students: progresses.students,
                }
            }
            return courseStatistics.value
        } catch (err) {
            error.value = 'Ошибка при загрузке статистики'
            console.error(err)
        } finally {
            isLoading.value = false
        }
    }

    function setCurrentProgress(progress: UserCourseProgress | null) {
        currentProgress.value = progress
    }

    function clearError() {
        error.value = null
    }

    return {
        currentProgress,
        allProgresses,
        courseStatistics,
        isLoading,
        error,
        activeCourses,
        completedCourses,
        getCourseProgress,
        fetchMyProgress,
        fetchCourseProgress,
        startCourse,
        completeLesson,
        completeCourse,
        resetCourseProgress,
        fetchCourseStatistics,
        setCurrentProgress,
        clearError
    }
})