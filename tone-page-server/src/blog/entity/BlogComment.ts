import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @Column({ type: 'uuid', nullable: true })
    blogId: string | null;

    @Column({ type: 'uuid', nullable: true })
    parentId: string | null;
}