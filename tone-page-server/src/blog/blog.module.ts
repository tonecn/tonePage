import { Module } from '@nestjs/common';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entity/Blog.entity';
import { BlogComment } from './entity/BlogComment';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, BlogComment])],
  controllers: [BlogController],
  providers: [BlogService],
  exports: [BlogService],
})
export class BlogModule { }
