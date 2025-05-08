import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserRole } from "src/role/entities/user-role.entity";
import { IsNull, MoreThanOrEqual, Repository } from "typeorm";

@Injectable()
export class UserRoleService {
    constructor(
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) { }

    async findRoleIdsByUserId(userId: string): Promise<string[]> {
        const userRoles = await this.userRoleRepository.find({
            where: {
                userId,
            }
        });

        return userRoles.map(ur => ur.roleId);
    }

    async findValidRoleIdsByUserId(userId: string): Promise<string[]> {
        return (await this.findValidRolesByUserId(userId)).map(ur => ur.roleId);
    }

    async findValidRolesByUserId(userId: string) {
        const now = new Date();

        return this.userRoleRepository.find({
            where: [
                {
                    userId,
                    isEnabled: true,
                    expiredAt: MoreThanOrEqual(now),
                },
                {
                    userId,
                    isEnabled: true,
                    expiredAt: IsNull(),
                }
            ]
        })
    }

    async addUserRole(userRole: Pick<UserRole, 'roleId' | 'userId' | 'isEnabled' | 'expiredAt'>): Promise<void> {
        const newUserRole = this.userRoleRepository.create(userRole);
        await this.userRoleRepository.save(newUserRole);
    }

    async deleteUserRole(userId: string, roleId: string): Promise<void> {
        await this.userRoleRepository.delete({
            userId,
            roleId,
        });
    }
}