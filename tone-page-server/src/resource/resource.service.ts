import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Resource } from './entity/resource.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ResourceService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
  ) {}

  async findAll(): Promise<Resource[]> {
    return this.resourceRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: string): Promise<Resource> {
    return this.resourceRepository.findOne({ where: { id } });
  }

  async create(data: Partial<Resource>): Promise<Resource> {
    const resource = this.resourceRepository.create(data);
    return this.resourceRepository.save(resource);
  }

  async update(id: string, data: Partial<Resource>): Promise<Resource> {
    await this.resourceRepository.update(id, data);
    return this.resourceRepository.findOne({ where: { id } });
  }

  async delete(id: string): Promise<void> {
    await this.resourceRepository.delete(id);
  }
}
