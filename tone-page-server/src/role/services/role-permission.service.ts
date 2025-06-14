import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolePermission } from '../entities/role-permission.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async findPermissionIdsByRoleIds(roleIds: string[]): Promise<string[]> {
    const rolePermissions = await this.rolePermissionRepository.find({
      where: {
        roleId: In(roleIds),
      },
    });

    return rolePermissions.map((rp) => rp.permissionId);
  }

  async addRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    const rolePermissions = permissionIds.map((permissionId) => {
      const rolePermission = this.rolePermissionRepository.create({
        roleId,
        permissionId,
      });
      return rolePermission;
    });

    await this.rolePermissionRepository.save(rolePermissions);
  }

  async deleteRolePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: In(permissionIds),
    });
  }
}
