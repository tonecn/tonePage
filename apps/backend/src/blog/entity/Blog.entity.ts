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
import { BlogPermission } from '../blog.permission.enum';

/** @todo 考虑后续将权限的数据类型替换为json，以提高查询效率 */
@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'text', nullable: true })
  content: string;

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
  @OneToMany(() => BlogComment, (comment) => comment.blog)
  comments: BlogComment[];
}
