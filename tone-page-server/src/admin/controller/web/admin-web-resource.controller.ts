import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { CreateResourceDto } from "src/admin/dto/admin-web/create-resource.dto";
import { ResourceService } from "src/resource/resource.service";

@Controller('/admin/web/resource')
export class AdminWebResourceController {

    constructor(
        private readonly resourceService: ResourceService,
    ) { }

    @Get()
    async list() {
        return this.resourceService.findAll();
    }

    @Get(':id')
    async get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
        return this.resourceService.findById(id);
    }

    @Post()
    async create(@Body() data: CreateResourceDto) {
        return this.resourceService.create(data);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() data: CreateResourceDto
    ) {
        return this.resourceService.update(id, data);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.resourceService.delete(id);
    }
}