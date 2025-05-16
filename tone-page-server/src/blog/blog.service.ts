import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Blog } from './entity/Blog.entity';
import { Repository } from 'typeorm';

@Injectable()
export class BlogService {

    constructor(
        @InjectRepository(Blog)
        private readonly blogRepository: Repository<Blog>,
    ) { }

    async list() {
        return this.blogRepository.find({
            where: { deletedAt: null },
            order: {
                createdAt: 'DESC',
            }
        })
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
}
