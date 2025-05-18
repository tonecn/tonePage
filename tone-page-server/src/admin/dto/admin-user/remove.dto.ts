import { Transform } from "class-transformer";
import { IsBoolean } from "class-validator";

export class RemoveUserDto {
    @Transform(({ value }) => value === 'true')
    @IsBoolean({ message: '需指定删除类型' })
    soft: boolean;
}