import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Permission } from "../entities/permission.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class PermissionService {

    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepository: Repository<Permission>,
    ) { }

    async findPermissionNamesByPermissionIds(permissionIds: string[]): Promise<string[]> {
        const permissions = await this.findPermissionsByPermissionIds(permissionIds);
        return permissions.map(permission => permission.name);
    }

    async findPermissionsByPermissionIds(permissionIds: string[]): Promise<Permission[]> {
        return this.permissionRepository.find({
            where: {
                id: In(permissionIds),
            }
        })
    }

    async list() {
        return this.permissionRepository.find();
    }

    async create(permission: Pick<Permission, 'name' | 'description'>): Promise<Permission> {
        const newPermission = this.permissionRepository.create(permission);
        return this.permissionRepository.save(newPermission);
    }

    async delete(permissionId: string): Promise<void> {
        const existingPermission = await this.permissionRepository.findOne({ where: { id: permissionId } });
        if (!existingPermission) {
            throw new BadRequestException('Permission not found');
        }
        await this.permissionRepository.delete(existingPermission.id);
    }
}