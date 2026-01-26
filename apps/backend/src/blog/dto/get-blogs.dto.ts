import { IsBoolean, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetBlogsDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    page?: number;

    @IsOptional()
    @Transform(({ value }) => parseInt(value))
    @IsNumber()
    @Min(1)
    pageSize?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    withAll?: boolean;
}
