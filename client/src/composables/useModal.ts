import { ref } from 'vue'

type ModalId = string | symbol

interface ModalState<T = unknown> {
    id: ModalId | null
    data: T | null
}

interface ConfirmOptions {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: 'warning' | 'info' | 'danger' | 'success'
    onConfirm?: () => void
    onCancel?: () => void
}

const activeModal = ref<ModalState>({
    id: null,
    data: null
})

export function useModal() {
    const open = <T = unknown>(modalId: ModalId, data?: T): void => {
        activeModal.value = {
            id: modalId,
            data: data ?? null
        }
    }

    const close = (): void => {
        activeModal.value = {
            id: null,
            data: null
        }
    }

    const isOpen = (modalId: ModalId): boolean => {
        return activeModal.value.id === modalId
    }

    const getData = <T = unknown>(): T | null => {
        return activeModal.value.data as T | null
    }

    const confirm = (options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            open('confirm', {
                ...options,
                onConfirm: () => {
                    options.onConfirm?.()
                    resolve(true)
                },
                onCancel: () => {
                    options.onCancel?.()
                    resolve(false)
                }
            })
        })
    }

    const openCreateCourse = (): void => {
        open('create-course')
    }

    return {
        activeModal,
        open,
        close,
        isOpen,
        getData,
        confirm,
        openCreateCourse
    }
}