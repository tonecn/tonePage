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

  async getAdminList(page: number, pageSize: number, query?: string) {
    const qb = this.blogRepository.createQueryBuilder('blog');
    
    if (query) {
        qb.andWhere('(LOWER(blog.title) LIKE LOWER(:query) OR LOWER(blog.description) LIKE LOWER(:query) OR LOWER(blog.slug) LIKE LOWER(:query))', { query: `%${query}%` });
    }

    qb.select([
      'blog.id',
      'blog.slug',
      'blog.title',
      'blog.description',
      'blog.viewCount',
      'blog.permissions',
      'blog.createdAt',
      'blog.updatedAt',
      // Explicitly excluding 'content' and 'password_hash' by not selecting them
    ]);

    qb.orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);
      
    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async getPublicList(page: number, pageSize: number) {
    const qb = this.blogRepository.createQueryBuilder('blog');

    // Filter by permission: Must have 'Public' permission
    // Assuming permissions is a stored string (SimpleArray) like "Public,List"
    // Using LIKE for SimpleArray search in SQLite/Postgres if not using native array types
    // Or if it's Postgres array, logic might differ. 
    // Looking at existing code, it was using memory filter or assumed LIKE.
    // Let's assume standard string match for now.
    qb.where('blog.permissions LIKE :permission', { permission: `%${BlogPermission.List}%` });

    qb.select([
      'blog.id',
      'blog.slug',
      'blog.title',
      'blog.description',
      'blog.viewCount',
      'blog.createdAt',
    ]);

    qb.orderBy('blog.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return { items, total };
  }

  async getSitemapList() {
    const qb = this.blogRepository.createQueryBuilder('blog');
    
    qb.where('blog.permissions LIKE :permission', { permission: `%${BlogPermission.List}%` });

    qb.select([
      'blog.slug',
      'blog.updatedAt',
    ]);
    
    // No pagination
    
    const items = await qb.getMany();
    // Return format compatible with existing expected response or just items? 
    // Existing list returned { items, total } for withAll.
    // Let's return the simplified list.
    return { items, total: items.length };
  }

  // Deprecated usage mapping? No, we will update controllers.
  /* 
  async list(
    option: {
  ...
  */

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
