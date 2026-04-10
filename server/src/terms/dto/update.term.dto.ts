import { PartialType } from "@nestjs/mapped-types";
import { CreateTermDto } from "./create.term.dto";
import { $Enums } from "../../../prisma/generated/prisma";

export class UpdateTermDto extends PartialType(CreateTermDto) {
    name?: string | undefined;
    type?: $Enums.TermTypes | undefined;
}