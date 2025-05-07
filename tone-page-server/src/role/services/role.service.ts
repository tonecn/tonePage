import { Injectable } from "@nestjs/common";
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
}