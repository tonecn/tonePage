import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid', { unique: true, default: () => 'gen_random_uuid()' })
    userId: string;

    @Column({ length: 32 })
    @Index({ unique: true })
    username: string;

    @Column({ length: 30 })
    nickname: string;

    @Column({ nullable: true, type: 'char', length: 32 })
    salt: string;

    @Column({ nullable: true, type: 'char', length: 64 })
    hashed_password: string;

    @Column({ nullable: true, length: 254 })// RFC 5321
    @Index({ unique: true })
    email: string;

    @Column({ nullable: true, length: 20 })// China Mainland
    @Index({ unique: true })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn({ precision: 3 })
    created_at: Date;

    @UpdateDateColumn({ precision: 3 })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true, precision: 3 })
    deleted_at: Date;
}