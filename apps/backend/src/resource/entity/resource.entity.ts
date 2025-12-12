import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

type ResourceTag = {
  name: string;
  type: string;
};

@Entity()
export class Resource {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column()
  link: string;

  @Column('jsonb')
  tags: ResourceTag[];

  @CreateDateColumn({ precision: 3 })
  createdAt: Date;

  @UpdateDateColumn({ precision: 3 })
  updatedAt: Date;
}
