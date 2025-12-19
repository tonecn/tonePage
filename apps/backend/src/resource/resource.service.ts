import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PublicResource, Resource } from './entity/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) { }

  async findAll(): Promise<PublicResource[]> {
    return this.resourceRepository.find({
      select: ['id', 'title', 'description', 'imageUrl', 'link', 'tags'],
      order: {
        updatedAt: 'DESC',
      },
    });
  }
}
