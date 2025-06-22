import { IsString } from "class-validator";

export class SetBlogPasswordDto {
    @IsString()
    password: string;
}