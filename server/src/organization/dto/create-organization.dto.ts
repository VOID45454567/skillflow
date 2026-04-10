import { IsNotEmpty } from "class-validator"

export class CreateOrganizationDto {
    @IsNotEmpty({ message: "Укажите название" })
    name: string

    @IsNotEmpty({ message: "Укажите описание" })
    description: string
}
