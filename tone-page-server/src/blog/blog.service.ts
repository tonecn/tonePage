import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/Blog.entity';
import { Repository } from 'typeorm';
import { BlogComment } from './entity/BlogComment';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(BlogComment)
    private readonly blogCommentRepository: Repository<BlogComment>,
  ) {}

  async list() {
    return this.blogRepository.find({
      where: { deletedAt: null },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async create(blog: Partial<Blog>) {
    const newBlog = this.blogRepository.create(blog);
    return this.blogRepository.save(newBlog);
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
    return this.blogRepository.findOneBy({ id });
  }

  async incrementViewCount(id: string) {
    await this.blogRepository.increment({ id }, 'viewCount', 1);
  }

  async getComments(id: string) {
    return this.blogCommentRepository.find({
      where: { blogId: id },
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async createComment(comment: Partial<BlogComment>) {
    const newComment = this.blogCommentRepository.create(comment);
    return this.blogCommentRepository.save(newComment);
  }
}
