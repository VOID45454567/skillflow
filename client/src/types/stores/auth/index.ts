import type { ValidationError } from "@/types/api/errors/validation-error";
import type { LoginUserDto, RegisterUserDto } from "@/types/user/dto";

export interface IRegisterState extends RegisterUserDto {
    validationErorrs: ValidationError[]
    credencialsError: string
}

export interface ILoginState extends LoginUserDto {
    validationErorrs: ValidationError[]
    credencialsError: string

}