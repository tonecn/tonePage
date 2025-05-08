import { IsOptional, IsString } from "class-validator";

export class CreateDto {
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