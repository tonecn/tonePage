import { ArrayMinSize, IsArray, IsUUID } from "class-validator";

export class SetRolePermissionsDto {
    @IsArray()
    @ArrayMinSize(1)
    @IsUUID('4', { each: true })
    permissionIds: string[];
}