import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from "@nestjs/common";
import { RoleService } from "src/role/services/role.service";
import { CreateRoleDto } from "../dto/admin-role/create-role.dto";

@Controller('admin/role')
export class AdminRoleController {

    constructor(
        private readonly roleService: RoleService,
    ) { }

    @Get()
    async list() {
        return this.roleService.list();
    }

    @Post()
    async create(
        @Body() dto: CreateRoleDto
    ) {
        return this.roleService.create(dto);
    }

    @Delete(':id')
    async delete(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        return this.roleService.delete(id);
    }
}