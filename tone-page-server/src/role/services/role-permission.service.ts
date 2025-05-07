import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RolePermission } from "../entities/role-permission.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class RolePermissionService {

    constructor(
        @InjectRepository(RolePermission)
        private readonly rolePermissionRepository: Repository<RolePermission>,
    ) { }

    async findPermissionIdsByRoleIds(roleIds: string[]): Promise<string[]> {
        const rolePermissions = await this.rolePermissionRepository.find({
            where: {
                roleId: In(roleIds),
            }
        });

        return rolePermissions.map(rp => rp.permissionId);
    }
}