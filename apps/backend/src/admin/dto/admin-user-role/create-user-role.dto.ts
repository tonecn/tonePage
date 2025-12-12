import { IsBoolean, IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateUserRoleDto {
  @IsUUID('4')
  roleId: string;

  @IsBoolean()
  isEnabled: boolean;

  @IsOptional()
  @IsDateString()
  expiredAt?: Date;
}
