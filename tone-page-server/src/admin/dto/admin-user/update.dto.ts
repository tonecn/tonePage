import { IsOptional, IsString } from "class-validator";

export class UpdateDto {
    @IsOptional()
    @IsString()
    username?: string;

    @IsOptional()
    @IsString()
    nickname?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    avatar?: string;
}