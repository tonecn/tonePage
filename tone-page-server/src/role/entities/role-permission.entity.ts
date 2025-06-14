import { Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission {
  @PrimaryColumn('uuid')
  roleId: string;

  @PrimaryColumn('uuid')
  permissionId: string;
}
