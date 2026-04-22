import type { SelectOption } from '@/types/common'
import type { CourseCardData } from '@/types/course'
import { CourseLevels } from '@/types/enums/course-levels'

export const mockCourses: CourseCardData[] = [
    {
        id: 1,
        title: 'Vue.js с нуля до профи',
        description: 'Полный курс по Vue 3, Composition API, Pinia и Vue Router',
        level: CourseLevels.ADVANCED,
        studentsCount: 234,
        duration: 42,
        colorGradient: {
            from: '#818cf8',
            to: '#a78bfa'
        },
        isFree: false,
        price: 4990
    },
    {
        id: 2,
        title: 'UI/UX Дизайн в Figma',
        description: 'Создание современных интерфейсов с использованием Figma',
        level: CourseLevels.ADVANCED,
        studentsCount: 189,
        duration: 28,
        colorGradient: {
            from: '#f472b6',
            to: '#fb7185'
        },
        isFree: true,
        price: 0
    },
    {
        id: 3,
        title: 'Управление проектами',
        description: 'Agile, Scrum и Kanban для эффективной работы команды',
        level: CourseLevels.ADVANCED,
        studentsCount: 156,
        duration: 36,
        colorGradient: {
            from: '#67e8f9',
            to: '#22d3ee'
        },
        isFree: false,
        price: 6990
    }
]

export const courseLevelOptions: SelectOption<CourseLevels>[] = [
    { value: CourseLevels.BEGINNER, label: 'Начинающий' },
    { value: CourseLevels.INTERMEDIATE, label: 'Средний' },
    { value: CourseLevels.ADVANCED, label: 'Продвинутый' },
    { value: CourseLevels.PROFESSIONAL, label: 'Профессиональный' },
]