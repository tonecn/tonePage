import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdminUserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getUser(page = 1, pageSize = 20) {
        const queryBuilder = this.userRepository.createQueryBuilder('user')

        queryBuilder.orderBy('user.createdAt', 'DESC');

        queryBuilder.skip((page - 1) * pageSize);
        queryBuilder.take(pageSize);

        const [items, total] = await queryBuilder.getManyAndCount();
        return {
            items,
            total,
            page,
            pageSize,
        }
    }
}