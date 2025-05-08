import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Role } from "../entities/role.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class RoleService {

    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    async findRoleNamesByRoleIds(roleIds: string[]): Promise<string[]> {
        const roles = await this.findRolesByRoleIds(roleIds);
        return roles.map(role => role.name);
    }

    async findRolesByRoleIds(roleIds: string[]): Promise<Role[]> {
        return this.roleRepository.find({
            where: {
                id: In(roleIds),
            }
        })
    }

    async create(role: Pick<Role, 'name' | 'localName'>): Promise<Role> {
        const newRole = this.roleRepository.create(role);
        return this.roleRepository.save(newRole);
    }

    async list(): Promise<Role[]> {
        return this.roleRepository.find();
    }

    async delete(roleId: string): Promise<void> {
        const existingRole = await this.roleRepository.findOne({ where: { id: roleId } });
        if (!existingRole) {
            throw new BadRequestException('Role not found');
        }
        await this.roleRepository.delete(existingRole.id);
    }
}