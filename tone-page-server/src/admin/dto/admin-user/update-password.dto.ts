import { IsString, Length, Matches } from "class-validator";

export class UpdatePasswordDto {
    @IsString()
    @Length(6, 32)
    @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{6,32}$/)
    password: string;
}