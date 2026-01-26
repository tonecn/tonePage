import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: '页码必须为整数' })
    @Min(1, { message: '页码必须大于等于1' })
    page: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: '每页数量必须为整数' })
    @Min(1, { message: '每页数量必须大于等于1' })
    pageSize: number = 10;

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: '查询字符串必须为字符串类型' })
    query?: string;
}
