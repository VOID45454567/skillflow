import { defineStore } from 'pinia'
import { ref } from 'vue'
import { API } from '@/api'
import type { LessonContent, ContentSection } from '@/types/course/Lesson'
import type { Course } from '@/types/course'
import { AxiosError } from 'axios'
import { CourseVisibilityTypes } from '@/types/enums/course-visibility-types'

interface LessonWithTemp {
    tempId?: number
    title?: string
    requredTimeInMinutes?: number
    goals?: string[]
    content: LessonContent
    order?: number
}

interface CourseFormData {
    title: string
    description: string
    isFree: boolean
    price?: number
    termIds: number[]
    level: string
    visibility: 'ORGANIZATION' | 'PUBLISHED' | 'DRAFT'
    lessons: any[]
    orgId?: number
}

export const useCoursesStore = defineStore('courses', () => {
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const currentCourse = ref<Course | undefined>(undefined)
    const courses = ref<Course[]>([])

    const transformSectionForApi = (section: ContentSection): any => {
        const baseSection = {
            type: section.type,
        }

        switch (section.type) {
            case 'text':
                return {
                    ...baseSection,
                    content: section.content,
                    format: section.format,
                    annotations: section.annotations,
                }

            case 'media':
                return {
                    ...baseSection,
                    url: section.url,
                    altText: section.altText,
                    caption: section.caption,
                    width: section.width,
                    height: section.height,
                }

            case 'code':
                return {
                    ...baseSection,
                    language: section.language,
                    code: section.code,
                    description: section.description,
                    executable: section.executable,
                    editable: section.editable,
                    output: section.output,
                    testCases: section.testCases,
                    hints: section.hints,
                }
            default:
                return baseSection
        }
    }


    const transformLessonForApi = (lesson: LessonWithTemp, order: number): any => {
        return {
            title: lesson.title || 'Без названия',
            goals: lesson.goals || [],
            order: order,
            requredTime: lesson.requredTimeInMinutes,
            content: {
                sections: (lesson.content?.sections || []).map(transformSectionForApi)
            }
        }
    }

    const transformCourseForApi = (
        courseData: {
            title: string
            description: string
            level: string
            isFree: boolean
            price: number
        },
        selectedCategory: { id: number } | null,
        selectedTags: Array<{ id: number }>,
        lessons: LessonWithTemp[],
        visibility: 'ORGANIZATION' | 'PUBLISHED' | 'DRAFT' = 'DRAFT',
        orgId?: number
    ): CourseFormData => {
        const termIds: number[] = []
        if (selectedCategory) {
            termIds.push(selectedCategory.id)
        }
        selectedTags.forEach(tag => termIds.push(tag.id))

        const lessonsForApi = lessons.map((lesson, index) =>
            transformLessonForApi(lesson, index)
        )

        return {
            title: courseData.title,
            description: courseData.description,
            isFree: courseData.isFree,
            price: courseData.isFree ? undefined : courseData.price,
            termIds: termIds,
            level: courseData.level,
            visibility: visibility,
            lessons: lessonsForApi,
            ...(orgId && { orgId })
        }
    }

    const createFormData = (courseData: CourseFormData): FormData => {
        const formData = new FormData()

        const addFilesRecursively = (obj: any, currentPath: string = '') => {
            if (!obj) return

            if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    const newPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`
                    addFilesRecursively(item, newPath)
                })
                return
            }

            if (obj && typeof obj === 'object') {
                if (obj instanceof File || obj instanceof Blob) {
                    formData.append(currentPath, obj)
                    return
                }
                if (obj.file instanceof File) {
                    formData.append(`${currentPath}.file`, obj.file)
                    return
                }
                Object.keys(obj).forEach(key => {
                    if (key === 'previewUrl' || key === 'tempId' || key === 'id') {
                        return
                    }
                    const newPath = currentPath ? `${currentPath}.${key}` : key
                    addFilesRecursively(obj[key], newPath)
                })
            }
        }

        addFilesRecursively(courseData)

        const dataString = JSON.stringify(courseData)
        formData.append('data', dataString)

        console.log('📦 FormData entries:')
        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`  ${key}: File(${value.name}, ${value.size} bytes)`)
            } else {
                const preview = value.length > 100 ? value.substring(0, 100) + '...' : value
                console.log(`  ${key}: ${preview}`)
            }
        }

        return formData
    }

    const getAll = async () => {
        const result = await API.courses.getAll()
        if (!(result instanceof AxiosError)) {
            courses.value = result
        }
    }

    const makeCoursePaid = async (courseId: number, count: number) => {
        await API.courses.makePaid(courseId, count)
        currentCourse.value! = { ...currentCourse.value!, isFree: false, price: count }
    }

    const createCourse = async (
        courseData: {
            title: string
            description: string
            level: string
            isFree: boolean
            price: number
        },
        selectedCategory: { id: number } | null,
        selectedTags: Array<{ id: number }>,
        lessons: LessonWithTemp[],
        visibility: 'ORGANIZATION' | 'PUBLISHED' | 'DRAFT' = 'DRAFT',
        orgId?: number
    ): Promise<any> => {
        isLoading.value = true
        error.value = null

        try {
            const apiCourseData = transformCourseForApi(
                courseData,
                selectedCategory,
                selectedTags,
                lessons,
                visibility,
                orgId
            )

            console.log('📤 Creating course:', apiCourseData)

            const formData = createFormData(apiCourseData)

            const response = await API.courses.create(formData, orgId)

            if (response?.data) {
                currentCourse.value = response.data
                courses.value.unshift(response.data)
                return response.data
            }

            throw new Error('Failed to create course')
        } catch (err: any) {
            console.error('❌ Failed to create course:', err)
            error.value = err?.message || 'Не удалось создать курс'
            throw err
        } finally {
            isLoading.value = false
        }
    }
    const addReview = async (courseId: number, text: string) => {
        const response = await API.courses.makeReview(courseId, text)
        return response
    }

    const getCourseById = async (id: number) => {
        try {
            const response = await API.courses.getById(id)
            if (response instanceof AxiosError) {
                return { error: response }
            }
            console.log(response);

            currentCourse.value = response
        } catch (err: any) {
            console.error('❌ Failed to fetch course:', err)
            error.value = err?.message || 'Не удалось загрузить курс'
            throw err
        }
    }

    const makeTransactionWithCourse = async (courseId: number, type: 'PURCHACE' | 'GIFT' | 'REFUND', giftToId?: number) => {
        switch (type) {
            case 'GIFT':
                await API.courses.gift(courseId, giftToId!)
                break;
            case 'PURCHACE':
                await API.courses.buyCourse(courseId)
                break;
            case 'REFUND':
                await API.courses.refund(courseId)
                break;
            default:
                break;
        }
    }

    const updateCourseVisibility = async (courseId: number) => {
        await API.courses.publishCourse(courseId)
        currentCourse.value = { ...currentCourse.value!, visibility: CourseVisibilityTypes.PUBLISHED }
    }

    // const updateCourse = async (id: number, courseData: any): Promise<any> => {
    //     isLoading.value = true
    //     error.value = null

    //     try {
    //         const formData = createFormData(courseData)
    //         const response = await API.courses.update(id, formData)

    //         if (response?.data) {
    //             currentCourse.value = response.data

    //             // Обновляем в списке
    //             const index = courses.value.findIndex(c => c.id === id)
    //             if (index !== -1) {
    //                 courses.value[index] = response.data
    //             }

    //             return response.data
    //         }

    //         throw new Error('Failed to update course')
    //     } catch (err: any) {
    //         console.error('❌ Failed to update course:', err)
    //         error.value = err?.message || 'Не удалось обновить курс'
    //         throw err
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    // Удаление курса
    // const deleteCourse = async (id: number): Promise<void> => {
    //     isLoading.value = true
    //     error.value = null

    //     try {
    //         await API.courses.delete(id)
    //         courses.value = courses.value.filter(c => c.id !== id)
    //         if (currentCourse.value?.id === id) {
    //             currentCourse.value = null
    //         }
    //     } catch (err: any) {
    //         console.error('❌ Failed to delete course:', err)
    //         error.value = err?.message || 'Не удалось удалить курс'
    //         throw err
    //     } finally {
    //         isLoading.value = false
    //     }
    // }

    // Валидация курса перед отправкой
    const validateCourse = (
        courseData: { title: string; description: string },
        selectedCategory: { id: number } | null,
        lessons: LessonWithTemp[]
    ): { valid: boolean; error?: string } => {
        if (!courseData.title) {
            return { valid: false, error: 'Введите название курса' }
        }
        if (!courseData.description) {
            return { valid: false, error: 'Введите описание курса' }
        }
        if (!selectedCategory) {
            return { valid: false, error: 'Выберите категорию' }
        }
        if (lessons.length === 0) {
            return { valid: false, error: 'Добавьте хотя бы один урок' }
        }

        // Проверяем, что у всех уроков есть цели
        const lessonsWithoutGoals = lessons.filter(l => !l.goals || l.goals.length === 0)
        if (lessonsWithoutGoals.length > 0) {
            return {
                valid: false,
                error: `Урок "${lessonsWithoutGoals[0]!.title || 'Без названия'}" не имеет целей`
            }
        }

        return { valid: true }
    }

    // Очистка ошибки
    const clearError = () => {
        error.value = null
    }

    // Очистка текущего курса
    const clearCurrentCourse = () => {
        currentCourse.value = undefined
    }

    return {
        // State
        isLoading,
        error,
        currentCourse,
        courses,

        // Transform methods
        transformSectionForApi,
        transformLessonForApi,
        transformCourseForApi,
        createFormData,

        // API methods
        createCourse,
        getCourseById,
        makeTransactionWithCourse,
        makeCoursePaid,
        addReview,
        updateCourseVisibility,
        getAll,

        // updateCourse,
        // deleteCourse,

        // Utils
        validateCourse,
        clearError,
        clearCurrentCourse,
    }
})