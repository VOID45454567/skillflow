import type { ValidationError } from "@/types/api/errors/validation-error";
import type { AxiosError } from "axios";

export const processValidationError = (error: AxiosError): ValidationError[] => {
    return error.response!.data!.message as ValidationError[]
}