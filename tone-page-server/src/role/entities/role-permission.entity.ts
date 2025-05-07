import { Entity, Index, PrimaryColumn } from "typeorm";

@Entity()
@Index(['roleId', 'permissionId'])
export class RolePermission {
    @PrimaryColumn('uuid')
    roleId: string;

    @PrimaryColumn('uuid')
    permissionId: string;
}