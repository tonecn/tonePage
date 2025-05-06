import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

type UserFindOptions = Partial<Pick<User, 'userId' | 'username' | 'phone' | 'email'>>;

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async findOne(options: UserFindOptions | UserFindOptions[]): Promise<User | null> {
        if (Object.keys(options).length === 0) {
            return null;
        }
        return this.userRepository.findOne({ where: options });
    }

    async create(user: Partial<User>): Promise<User> {
        const newUser = this.userRepository.create(user);
        return this.userRepository.save(newUser);
    }
}
