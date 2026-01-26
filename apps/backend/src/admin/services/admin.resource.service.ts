import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Resource } from "src/resource/entity/resource.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminResourceService {

    constructor(
        @InjectRepository(Resource)
        private readonly resourceRepository: Repository<Resource>,
    ) { }


    async findAll(page: number, pageSize: number, query?: string) {
        const qb = this.resourceRepository.createQueryBuilder('resource');

        if (query) {
            qb.where('LOWER(resource.title) LIKE LOWER(:query) OR LOWER(resource.description) LIKE LOWER(:query)', { query: `%${query}%` });
        }

        qb.orderBy('resource.updatedAt', 'DESC')
          .skip((page - 1) * pageSize)
          .take(pageSize);

        const [items, total] = await qb.getManyAndCount();

        return {
            items,
            total,
            page,
            pageSize
        };
    }

    async findById(id: string): Promise<Resource> {
        return this.resourceRepository.findOne({ where: { id } });
    }

    async create(data: Partial<Resource>): Promise<Resource> {
        const resource = this.resourceRepository.create(data);
        return this.resourceRepository.save(resource);
    }

    async update(data: Partial<Resource>): Promise<Resource> {
        // const updateRes =  await this.resourceRepository.update(id, data);
        // updateRes.affected
        // return this.resourceRepository.findOne({ where: { id } });
        return this.resourceRepository.save(data);
    }

    async delete(id: string): Promise<void> {
        await this.resourceRepository.delete(id);
    }
}