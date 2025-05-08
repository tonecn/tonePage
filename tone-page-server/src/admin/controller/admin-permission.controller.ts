import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { PermissionService } from "src/role/services/permission.service";
import { CreatePermissionDto } from "../dto/admin-permission/create-permission.dto";

@Controller('admin/permission')
export class AdminPermissionController {

    constructor(
        private readonly permissionService: PermissionService,
    ) { }

    @Get()
    async list() {
        return this.permissionService.list();
    }

    @Post()
    async create(
        @Body() dto: CreatePermissionDto
    ) {
        return this.permissionService.create(dto);
    }

    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        return this.permissionService.delete(id);
    }

}