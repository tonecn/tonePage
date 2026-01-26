import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserPublicProfile } from './entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';
import { BusinessException } from 'src/common/exceptions/business.exception';

type UserFindOptions = Partial<
  Pick<User, 'userId' | 'username' | 'phone' | 'email'>
>;

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async findOne(
    options: UserFindOptions | UserFindOptions[],
    additionalOptions?: { withDeleted?: boolean },
  ): Promise<User | null> {
    if (Array.isArray(options)) {
      if (options.length === 0) {
        throw new BusinessException({
          message: '查询条件不能为空',
        });
      }

      const users = await this.userRepository.find({
        where: options,
        withDeleted: additionalOptions?.withDeleted ?? false,
        take: 1,
      });
      return users[0] || null;
    }

    if (!options || typeof options !== 'object' || Object.keys(options).length === 0) {
      throw new BusinessException({
        message: '查询条件不能为空',
      });
    }

    return this.userRepository.findOne({
      where: options,
      withDeleted: additionalOptions?.withDeleted ?? false,
    });
  }

  /**
   * 仅包含用户可见字段
   */
  async findById(userId: string): Promise<UserPublicProfile | null> {
    return this.userRepository.findOne({
      select: ['userId', 'username', 'nickname', 'phone', 'email', 'avatar', 'roles', 'createdAt'],
      where: {
        userId,
      },
    });
  }

  async register(user: Partial<User>): Promise<null> {
    try {
      const newUser = this.userRepository.create(user);
      await this.userRepository.save(newUser);
      return null;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(this.getDuplicateErrorMessage(error));
      }
      throw new BadRequestException('创建用户失败');
    }
  }

  async update(userId: string, user: Partial<User>): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { userId },
    });
    if (!existingUser) {
      throw new BadRequestException('User not found');
    }
    try {
      Object.assign(existingUser, user);
      return await this.userRepository.save(existingUser);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ConflictException(this.getDuplicateErrorMessage(error));
      }
    }
  }

  async delete(userId: string, soft: boolean) {
    const existingUser = await this.userRepository.findOne({
      where: { userId },
      withDeleted: true,
    });
    if (!existingUser) {
      throw new BadRequestException('用户不存在');
    }

    if (existingUser.deletedAt && soft) {
      throw new BadRequestException('账户已注销，不得重复操作');
    }

    if (!existingUser.deletedAt && !soft) {
      throw new BadRequestException('账号未注销，请先注销再执行删除操作');
    }

    return soft
      ? await this.userRepository.softDelete(existingUser.userId)
      : await this.userRepository.delete(existingUser.userId);
  }

  hashPassword(password: string, salt: string): string {
    return createHash('sha256').update(`${password}${salt}`).digest('hex');
  }

  generateSalt(): string {
    return uuid().replace(/-/g, '');
  }

  async setPassword(userId: string, password: string) {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new BadRequestException('用户不存在');
    }
    const salt = this.generateSalt();
    user.password_hash = this.hashPassword(password, salt);
    user.salt = salt;
    await this.userRepository.save(user);
  }

  private getDuplicateErrorMessage(error: QueryFailedError): string {
    // 根据具体的错误信息返回友好的提示
    if (error.message.includes('IDX_user_username')) {
      return '账户名已被使用';
    }
    if (error.message.includes('IDX_user_email')) {
      return '邮箱已被使用';
    }
    if (error.message.includes('IDX_user_phone')) {
      return '手机号已被使用';
    }
    return '该登陆方式异常，请更换其他登陆方式或联系管理员';
  }

  async list(page = 1, pageSize = 20, query?: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.withDeleted();

    if (query) {
      queryBuilder.andWhere(
        '(LOWER(user.username) LIKE LOWER(:query) OR LOWER(user.nickname) LIKE LOWER(:query) OR LOWER(user.email) LIKE LOWER(:query) OR LOWER(user.phone) LIKE LOWER(:query))',
        { query: `%${query}%` },
      );
    }

    queryBuilder.select([
      'user.userId',
      'user.username',
      'user.nickname',
      'user.phone',
      'user.email',
      'user.avatar',
      'user.roles',
      'user.createdAt',
      'user.updatedAt',
      'user.deletedAt',
    ]);

    queryBuilder.orderBy('user.createdAt', 'DESC');

    queryBuilder.skip((page - 1) * pageSize);
    queryBuilder.take(pageSize);

    const [items, total] = await queryBuilder.getManyAndCount();
    return {
      items,
      total,
      page,
      pageSize,
    };
  }
}
