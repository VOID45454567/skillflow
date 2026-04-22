import { ref } from 'vue'
import type { Toast, ToastType } from '@/types/common'

const toasts = ref<Toast[]>([])
let toastCounter = 0

export function useToast() {
    const showToast = (type: ToastType, message: string, duration: number = 4000): number => {
        const id = ++toastCounter
        const now = new Date()
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

        toasts.value.push({ id, type, message, time })

        setTimeout(() => {
            removeToast(id)
        }, duration)

        return id
    }

    const removeToast = (id: number): void => {
        toasts.value = toasts.value.filter(t => t.id !== id)
    }

    const success = (message: string, duration?: number): number =>
        showToast('success', message, duration)

    const error = (message: string, duration?: number): number =>
        showToast('error', message, duration)

    const info = (message: string, duration?: number): number =>
        showToast('info', message, duration)

    const warning = (message: string, duration?: number): number =>
        showToast('warning', message, duration)

    const clearAll = (): void => {
        toasts.value = []
    }

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        info,
        warning,
        clearAll
    }
}