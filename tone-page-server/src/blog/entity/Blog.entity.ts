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

  // 权限关系 TODO

  // 关系
  @OneToMany(() => BlogComment, (blog) => blog.id)
  comments: BlogComment[];
}
