import { BadRequestException, Body, Controller, Get, Param, ParseUUIDPipe, Post, Req, Request, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { OptionalAuthGuard } from 'src/auth/strategies/OptionalAuthGuard';
import { UserService } from 'src/user/user.service';
import { createBlogCommentDto } from './dto/create.blogcomment.dto';

@Controller('blog')
export class BlogController {

    constructor(
        private readonly blogService: BlogService,
        private readonly userService: UserService,
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

    @Get(':id/comments')
    async getBlogComments(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    ) {
        const blog = await this.blogService.findById(id);
        if (!blog) throw new BadRequestException('文章不存在');

        return await this.blogService.getComments(id);
    }

    // 该接口允许匿名评论，但仍需验证userId合法性
    @UseGuards(OptionalAuthGuard)
    @Post(':id/comment')
    async createBlogComment(
        @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
        @Body() commentData: createBlogCommentDto,
        @Request() req,
    ) {
        const { userId } = req.user || {};
        const blog = await this.blogService.findById(id);
        if (!blog) throw new BadRequestException('文章不存在');

        let user = userId ? await this.userService.findOne({ userId }) : null;

        const comment = {
            ...commentData,
            blogId: id,
            user: user,
        };

        return await this.blogService.createComment(comment);
    }
}
