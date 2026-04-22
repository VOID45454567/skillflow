import type { CourseTerm } from '@/types/course/course-term'
import type { LessonContent } from '@/types/course/Lesson'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

interface DraftLesson {
    tempId?: number
    title: string
    requredTimeInMinutes: number
    goals: string[]
    content: LessonContent
    order?: number
}

interface CourseDraft {
    title: string
    description: string
    level: string
    isFree: boolean
    price: number
    category: CourseTerm | null
    tags: CourseTerm[]
    lessons: DraftLesson[]
    lastUpdated: string
    orgId?: number
}

const STORAGE_KEY = 'course_draft'

export const useCourseDraftStore = defineStore('courseDraft', () => {
    const currentDraft = ref<CourseDraft | null>(null)

    const loadDraft = (): CourseDraft | null => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY)
            if (stored) {
                currentDraft.value = JSON.parse(stored)
                console.log('📦 Draft loaded:', currentDraft.value)
                return currentDraft.value
            }
        } catch (err) {
            console.error('Failed to load draft:', err)
        }
        return null
    }

    const saveDraft = (draft: Omit<CourseDraft, 'lastUpdated'>) => {
        try {
            const draftToSave: CourseDraft = {
                ...draft,
                lastUpdated: new Date().toISOString()
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(draftToSave))
            currentDraft.value = draftToSave
            console.log('Draft saved:', draftToSave)
        } catch (err) {
            console.error('Failed to save draft:', err)
        }
    }

    const clearDraft = () => {
        localStorage.removeItem(STORAGE_KEY)
        currentDraft.value = null
        console.log('Draft cleared')
    }

    const hasDraft = (): boolean => {
        return localStorage.getItem(STORAGE_KEY) !== null
    }

    // Автосохранение при изменении
    const setupAutoSave = (getDraftData: () => Omit<CourseDraft, 'lastUpdated'>) => {
        const draftData = getDraftData()
        saveDraft(draftData)
    }

    return {
        currentDraft,
        loadDraft,
        saveDraft,
        clearDraft,
        hasDraft,
        setupAutoSave
    }
})