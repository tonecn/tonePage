import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';

@Entity()
@Index("IDX_user_userid", ["userId"], { unique: true })
@Index("IDX_user_username", ["username"], { unique: true })
@Index("IDX_user_email", ["email"], { unique: true, where: "email IS NOT NULL" })
@Index("IDX_user_phone", ["phone"], { unique: true, where: "phone IS NOT NULL" })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('uuid', { default: () => 'gen_random_uuid()' })
    userId: string;

    @Column({ length: 32 })
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

    @Column({
        nullable: true,
        length: 254,
        transformer: {
            to: (value: string | null) => value?.trim() || null,
            from: (value: string | null) => value,
        }
    })// RFC 5321
    email: string | null;

    @Column({
        nullable: true,
        length: 20,
        transformer: {
            to: (value: string | null) => value?.trim() || null,
            from: (value: string | null) => value,
        }
    })// China Mainland
    phone: string | null;

    @Column({
        nullable: true,
        transformer: {
            to: (value: string | null) => value?.trim() || null,
            from: (value: string | null) => value,
        }
    })
    avatar: string;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ precision: 3 })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, precision: 3 })
    deletedAt: Date;
}