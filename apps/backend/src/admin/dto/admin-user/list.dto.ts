import { Transform } from 'class-transformer';
import { PaginationDto } from '../common/pagination.dto';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';

export class ListDto extends PaginationDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: '页码必须为整数' })
    @Min(1, { message: '页码必须大于等于1' })
    page?: number = 1;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    @IsInt({ message: '每页数量必须为整数' })
    @Min(1, { message: '每页数量必须大于等于1' })
    pageSize?: number = 20;

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @IsString({ message: '查询字符串必须为字符串类型' })
    query?: string;
}
