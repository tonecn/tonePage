import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

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

    async update(userId: string, user: Partial<User>): Promise<User> {
        const existingUser = await this.userRepository.findOne({ where: { userId } });
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
        Object.assign(existingUser, user);
        return this.userRepository.save(existingUser);
    }

    async delete(userId: string): Promise<void> {
        const existingUser = await this.userRepository.findOne({ where: { userId } });
        if (!existingUser) {
            throw new BadRequestException('User not found');
        }
        await this.userRepository.softDelete(existingUser.id);
    }

    hashPassword(password: string, salt: string): string {
        return createHash('sha256').update(`${password}${salt}`).digest('hex');
    }

    generateSalt(): string {
        return uuid().replace(/-/g, '');
    }

    async setPassword(userId: string, password: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const salt = this.generateSalt();
        user.password_hash = this.hashPassword(password, salt);
        user.salt = salt;
        return this.userRepository.save(user);
    }
}
