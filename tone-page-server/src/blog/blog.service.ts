import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/Blog.entity';
import { Repository } from 'typeorm';
import { BlogComment } from './entity/BlogComment.entity';
import { BlogPermission } from './blog.permission.enum';
import { createHash } from 'crypto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
  ) { }

  async list(
    option: {
      withAll?: boolean;
    } = {},
  ) {
    return (
      await this.blogRepository.find({
        order: {
          createdAt: 'DESC',
        },
      })
    )
      .filter(
        (i) => option.withAll || i.permissions.includes(BlogPermission.List),
      )
      .map((i) => {
        if (option.withAll) {
          return i;
        }

        const { createdAt, deletedAt, id, title, viewCount } = i;
        return {
          createdAt,
          deletedAt,
          id,
          title,
          viewCount,
        };
      });
  }

  async create(dto: Partial<Blog> & { password: string }) {
    const { password, ...blog } = dto;
    if (blog.permissions.includes(BlogPermission.ByPassword)) {
      if (password) {
        blog.password_hash = createHash('sha256')
          .update(`${password}`)
          .digest('hex');
      }
    }

    const newBlog = this.blogRepository.create(blog);
    return this.blogRepository.save(newBlog);
  }

  async setPassword(id: string, password: string) {
    const blog = await this.findById(id);
    if (!blog) {
      throw new Error('博客不存在');
    }

    return (
      (
        await this.blogRepository.update(id, {
          ...blog,
          password_hash: this.hashPassword(password),
        })
      ).affected > 0
    );
  }

  async update(id: string, blog: Partial<Blog>) {
    await this.blogRepository.update(id, blog);
    return this.blogRepository.findOneBy({ id });
  }

  async remove(id: string) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) return null;
    return this.blogRepository.softRemove(blog);
  }

  async findById(id: string) {
    return await this.blogRepository.findOneBy({ id });
  }

  async incrementViewCount(id: string) {
    await this.blogRepository.increment({ id }, 'viewCount', 1);
  }

  async getComments(blog: Blog) {
    const comments = await this.blogCommentRepository.find({
      where: { blog: { id: blog.id } },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });

    return comments.map(comment => {
      const { blog, user, ...rest } = comment;
      return {
        ...rest,
        user: user ? {
          userId: user.userId,
          username: user.username,
          nickname: user.nickname,
        } : null,
      }
    })
  }

  async createComment(comment: Partial<BlogComment>) {
    const newComment = this.blogCommentRepository.create(comment);
    const savedComment = await this.blogCommentRepository.save(newComment, {});
    const { blog, ...commentWithoutBlog } = savedComment;
    return commentWithoutBlog;
  }

  hashPassword(password: string) {
    return createHash('sha256').update(`${password}`).digest('hex');
  }
}
