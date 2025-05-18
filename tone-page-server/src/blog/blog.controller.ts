import { BadRequestException, Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {

    constructor(
        private readonly blogService: BlogService,
    ) { }

    @Get()
    getBlogs() {
        return this.blogService.list();
    }

    @Get(':id')
    async getBlog(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        const blog = await this.blogService.findById(id);
        if (!blog) throw new BadRequestException('文章不存在');

        const blogDataRes = await fetch(`${blog.contentUrl}`);
        const blogContent = await blogDataRes.text();

        await this.blogService.incrementViewCount(id);
        return {
            id: blog.id,
            title: blog.title,
            createdAt: blog.createdAt,
            content: blogContent,
        };
    }
}
