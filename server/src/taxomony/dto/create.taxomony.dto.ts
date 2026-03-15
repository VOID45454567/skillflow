import { IsNotEmpty, IsString } from "class-validator";

export class CreateTaxomonyDto {
    @IsString({ message: 'Строка' })
    @IsNotEmpty({ message: 'Обязательное поле' })
    name: string
}