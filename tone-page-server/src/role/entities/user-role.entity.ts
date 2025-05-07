import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index(['userId', 'roleId'])
export class UserRole {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    roleId: string;

    @Column('uuid')
    userId: string

    @Column()
    isEnabled: boolean;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @Column({ nullable: true, precision: 3 })
    expiredAt?: Date;
}