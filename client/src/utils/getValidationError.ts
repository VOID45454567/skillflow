import type { ValidationError } from "@/types/api/errors/validation-error";

export const getValidationError = (fieldName: string, errors: ValidationError[]): string => {
    if (!errors) return "";


    const error = errors.find((err) => err.field === fieldName);

    return error?.constraints?.[0] || "";
};