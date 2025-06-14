import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Index(['sessionId', 'userId'])
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 36 })
  sessionId: string;

  @Column({ length: 36 })
  userId: string;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, precision: 3 })
  deletedAt: Date;
}
