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
                publishAt: 'DESC',
            }
        })
    }

}
