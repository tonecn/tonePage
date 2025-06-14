import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { PermissionService } from 'src/role/services/permission.service';
import { RolePermissionService } from 'src/role/services/role-permission.service';
import { SetRolePermissionsDto } from '../dto/admin-role-permission/set-role-permissions.dto';

@Controller('admin/roles/:roleId/permission')
export class AdminRolePermissionController {
  constructor(
    private readonly rolePermissionService: RolePermissionService,
    private readonly permissionService: PermissionService,
  ) {}

  @Get()
  async getRolePermissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
  ) {
    const permissionIds =
      await this.rolePermissionService.findPermissionIdsByRoleIds([roleId]);
    return await this.permissionService.findPermissionByIds(permissionIds);
  }

  @Post()
  async setRolePermissions(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
    @Body() dto: SetRolePermissionsDto,
  ) {
    return await this.rolePermissionService.addRolePermissions(
      roleId,
      dto.permissionIds,
    );
  }

  @Delete()
  async DeleteRolePermissionsDto(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
    @Body() dto: SetRolePermissionsDto,
  ) {
    return await this.rolePermissionService.deleteRolePermissions(
      roleId,
      dto.permissionIds,
    );
  }
}
