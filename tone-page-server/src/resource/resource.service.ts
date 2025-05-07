import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Resource } from './entity/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceService {
    constructor(
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
    ) { }

    async findAll(): Promise<Resource[]> {
        return this.resourceRepository.find({
            where: { deletedAt: null },
            order: {
                createdAt: 'DESC',
            }
        });
    }
}
