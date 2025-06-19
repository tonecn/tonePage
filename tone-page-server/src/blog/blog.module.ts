import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entity/Blog.entity';
import { BlogComment } from './entity/BlogComment.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Blog, BlogComment]),
    AuthModule,
    UserModule,
  ],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule {}
