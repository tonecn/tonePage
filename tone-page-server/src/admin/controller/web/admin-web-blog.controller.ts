import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post, Put } from "@nestjs/common";
import { CreateBlogDto } from "src/admin/dto/admin-web/create-blog.dto";
import { BlogService } from "src/blog/blog.service";

@Controller('/admin/web/blog')
export class AdminWebBlogController {

    constructor(
        private readonly adminWebBlogService: BlogService,
    ) { }

    @Get()
    async list() {
        return this.adminWebBlogService.list();
    }

    @Post()
    async create(
        @Body() dto: CreateBlogDto,
    ) {
        return this.adminWebBlogService.create(dto);
    }

    @Put(':id')
    async update(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() dto: CreateBlogDto,
    ) {
        return this.adminWebBlogService.update(id, dto);
    }

    @Get(':id')
    async get(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        return this.adminWebBlogService.findById(id);
    }

    @Delete(':id')
    async remove(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        return this.adminWebBlogService.remove(id);
    }
}