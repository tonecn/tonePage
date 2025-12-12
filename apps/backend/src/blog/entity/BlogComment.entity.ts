import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blog } from './Blog.entity';

@Entity()
export class BlogComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  ip: string;

  @Column()
  address: string;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @DeleteDateColumn({ precision: 3, nullable: true })
  deletedAt: Date;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User | null;

  @ManyToOne(() => Blog)
  @JoinColumn({ name: 'blogId' })
  blog: Blog | null;

  @Column({ type: 'uuid', nullable: true })
  parentId: string | null;
}
