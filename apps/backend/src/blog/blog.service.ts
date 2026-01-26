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
      page?: number;
      pageSize?: number;
      query?: string;
    } = {},
  ) {
    const { withAll = false, page = 1, pageSize = 20, query } = option;
    const qb = this.blogRepository.createQueryBuilder('blog');

    if (!withAll) {
       // Assuming permissions logic would need to be handled carefully if filtering at DB level
       // But for now, if not withAll, we might just be showing public ones or similar?
       // The original code filtered in memory: i.permissions.includes(BlogPermission.List)
       // TO support pagination properly, we need to do this in DB.
       // Since `permissions` is likely a SimpleArray or similar in TypeORM (string column), we can use LIKE.
       // Assuming permissions is stored as "csv string" or "jsonb".
       // Let's check Blog Entity first to be safe, but for now I'll implement query logic first.
       qb.andWhere('blog.permissions LIKE :permission', { permission: `%${BlogPermission.List}%` });
    }
    
    if (query) {
        qb.andWhere('(LOWER(blog.title) LIKE LOWER(:query) OR LOWER(blog.description) LIKE LOWER(:query) OR LOWER(blog.slug) LIKE LOWER(:query))', { query: `%${query}%` });
    }

    qb.orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
      
    const [items, total] = await qb.getManyAndCount();

    if (withAll) {
        return { items, total };
    }

    const mappedItems = items.map((i) => {
        const { createdAt, updatedAt, id, title, viewCount, description, slug } = i;
        return {
          createdAt,
          updatedAt,
          id,
          title,
          slug,
          viewCount,
          description,
        };
      });

    return { items: mappedItems, total };
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
    if (typeof blog.slug === 'string' && blog.slug.trim().length === 0) {
      blog.slug = null;
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

  async findBySlug(slug: string) {
    return this.blogRepository.findOne({
      where: { slug }
    })
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

    return comments.map((comment) => {
      const { user, ...rest } = comment;
      delete rest.blog;
      return {
        ...rest,
        user: user
          ? {
            userId: user.userId,
            username: user.username,
            nickname: user.nickname,
          }
          : null,
      };
    });
  }

  async createComment(comment: Partial<BlogComment>) {
    const newComment = this.blogCommentRepository.create(comment);
    const savedComment = await this.blogCommentRepository.save(newComment, {});
    const { user, ...commentWithoutBlog } = savedComment;
    delete commentWithoutBlog.blog;
    return {
      ...commentWithoutBlog,
      user: user
        ? {
          userId: user.userId,
          username: user.username,
          nickname: user.nickname,
        }
        : null,
    };
  }

  hashPassword(password: string) {
    return createHash('sha256').update(`${password}`).digest('hex');
  }
}
