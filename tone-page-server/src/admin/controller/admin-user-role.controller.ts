import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { RoleService } from 'src/role/services/role.service';
import { UserRoleService } from 'src/role/services/user-role.service';
import { CreateUserRoleDto } from '../dto/admin-user-role/create-user-role.dto';
import { DeleteUserRoleDto } from '../dto/admin-user-role/delete-user-role.dto';

@Controller('admin/users/:userId/role')
export class AdminUserRoleController {
  constructor(
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async getUserRoles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const userRoleIds = await this.userRoleService.findRoleIdsByUserId(userId);
    return await this.roleService.findRolesByRoleIds(userRoleIds);
  }

  @Post()
  async setUserRoles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() dto: CreateUserRoleDto,
  ) {
    return this.userRoleService.addUserRole({
      userId,
      roleId: dto.roleId,
      isEnabled: dto.isEnabled,
      expiredAt: dto.expiredAt,
    });
  }

  @Delete()
  async deleteUserRoles(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() dto: DeleteUserRoleDto,
  ) {
    return this.userRoleService.deleteUserRole(userId, dto.roleId);
  }
}
