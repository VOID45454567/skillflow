import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
    @IsEmail({}, { message: 'Некорректный email' })
    email: string;

    @IsString()
    @MinLength(3, { message: 'Логин должен быть минимум 3 символа' })
    @MaxLength(20, { message: 'Логин не может быть длиннее 20 символов' })
    login: string;

    @IsString()
    @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
    password: string;
}