import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
    @IsString({ message: 'Строка' })
    @IsNotEmpty({ message: 'Обязательно' })
    login: string
    @IsEmail({}, { message: 'Невалидный Email' })
    @IsNotEmpty({ message: 'Обязательно' })
    email: string
    @IsNotEmpty({ message: 'Обязательно' })
    password: string
}