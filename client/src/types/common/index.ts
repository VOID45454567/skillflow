export type ToastType = 'success' | 'error' | 'info' | 'warning'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | '4-xl' | '1/2' | "10/12"


export interface SelectOption<T = string> {
    value: T
    label: string
}

export interface Toast {
    id: number
    type: ToastType
    message: string
    time: string
}