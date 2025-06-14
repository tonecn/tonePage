import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';

class ResourceTagDto {
  @IsString()
  name: string;

  @IsString()
  type: string;
}

export class CreateResourceDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  imageUrl: string;

  @IsString()
  link: string;

  @ValidateNested({ each: true })
  @Type(() => ResourceTagDto)
  tags: ResourceTagDto[];
}
