import type { ValidationError } from "./errors/validation-error"

export interface IApiResponse<T = any> {
    success: boolean
    data?: T
    errors?: ValidationError[]
    error?: string
}