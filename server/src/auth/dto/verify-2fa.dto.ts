import { IsString, IsInt, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class Verify2faDto {
    @IsString()
    @Length(6, 6)
    code: string;

    @Type(() => Number)
    @IsInt()
    userId: number;
}