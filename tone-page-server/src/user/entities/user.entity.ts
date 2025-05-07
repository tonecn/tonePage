import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, In, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid', { unique: true, default: () => 'gen_random_uuid()' })
    @Index({ unique: true })
    userId: string;

    @Column({ length: 32 })
    @Index({ unique: true })
    username: string;

    @Column({ length: 30 })
    nickname: string;

    @BeforeInsert()
    generateDefaults() {
        if (!this.username) {
            this.username = `user_${uuidv4().replace(/-/g, '').slice(0, 27)}`;
        }
        if (!this.nickname) {
            this.nickname = `用户_${uuidv4().replace(/-/g, '').slice(0, 8)}`;
        }
    }

    @Column({ nullable: true, type: 'char', length: 32 })
    salt: string;

    @Column({ nullable: true, type: 'char', length: 64 })
    password_hash: string;

    @Column({ nullable: true, length: 254 })// RFC 5321
    @Index({ unique: true })
    email: string;

    @Column({ nullable: true, length: 20 })// China Mainland
    @Index({ unique: true })
    phone: string;

    @Column({ nullable: true })
    avatar: string;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ precision: 3 })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, precision: 3 })
    deletedAt: Date;
}