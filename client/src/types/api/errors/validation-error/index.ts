export interface ValidationError {
    field: string
    constraints: string[]
    value?: string
}