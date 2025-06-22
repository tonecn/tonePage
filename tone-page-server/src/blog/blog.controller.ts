import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { OptionalAuthGuard } from 'src/auth/strategies/OptionalAuthGuard';
import { UserService } from 'src/user/user.service';
import { createBlogCommentDto } from './dto/create.blogcomment.dto';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { BlogPermission } from './Blog.Permission.enum';

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
    @Param('p') password: string,
  ) {
    const blog = await this.blogService.findById(id);
    if (!blog) throw new BadRequestException('文章不存在或无权限访问');

    if (!blog.permissions.includes(BlogPermission.Public)) {
      // 无公开权限，则进一步检查是否有密码保护
      if (blog.permissions.includes(BlogPermission.ByPassword)) {
        throw new BadRequestException('文章不存在或无权限访问');
      } else {
        // 判断密码是否正确
        if (!password || this.blogService.hashPassword(password) !== blog.password_hash) {
          throw new BadRequestException('文章不存在或无权限访问');
        }
      }
    }

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
  @UseGuards(ThrottlerGuard, OptionalAuthGuard)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post(':id/comment')
  async createBlogComment(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() commentData: createBlogCommentDto,
    @Req() req,
  ) {
    const { userId } = req.user || {};
    const blog = await this.blogService.findById(id);
    if (!blog) throw new BadRequestException('文章不存在');

    const user = userId ? await this.userService.findById(userId) : null;

    const ip = req.headers['x-forwarded-for'] || req.ip;
    // 获取IP归属地
    let address = '未知';
    if (!['::1'].includes(ip)) {
      const addressRes = await (
        await fetch(
          `https://mesh.if.iqiyi.com/aid/ip/info?version=1.1.1&ip=${ip}`,
        )
      ).json();
      if (addressRes?.code == 0) {
        const country: string = addressRes?.data?.countryCN || '未知';
        const province: string = addressRes?.data?.provinceCN || '中国';
        if (country !== '中国') {
          // 非中国，显示国家
          address = country;
        } else {
          // 中国，显示省份
          address = province;
        }
      }
    }

    const comment = {
      ...commentData,
      blog,
      user,
      ip,
      address,
    };

    return await this.blogService.createComment(comment);
  }
}
