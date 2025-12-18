import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  sessionId: string;

  @Column({ length: 36 })
  userId: string;

  @Column({ nullable: true })
  disabledReason?: string;

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true, precision: 3 })
  deletedAt: Date;
}
