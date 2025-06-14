import { IsUUID } from 'class-validator';

export class DeleteUserRoleDto {
  @IsUUID('4')
  roleId: string;
}
