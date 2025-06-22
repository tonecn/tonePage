import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BlogComment } from './BlogComment.entity';
import { BlogPermission } from '../Blog.Permission.enum';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  contentUrl: string;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date;

  @DeleteDateColumn({ precision: 3, nullable: true })
  deletedAt: Date;

  // 权限
  @Column('simple-array', { default: '' })
  permissions: BlogPermission[];

  @Column({ nullable: true })
  password_hash: string | null;

  // 关系
  @OneToMany(() => BlogComment, (blog) => blog.id)
  comments: BlogComment[];
}
