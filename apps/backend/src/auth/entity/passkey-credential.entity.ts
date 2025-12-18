import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
@Index(['user'])
export class PasskeyCredential {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    // 关联用户
    @ManyToOne(() => User, user => user.passkeys, { onDelete: 'CASCADE' })
    user: User;

    // WebAuthn 必需字段
    @Column({ length: 255 })
    name: string; // 用户自定义名称，如 "iPhone", "工作笔记本"

    @Column({ unique: true })
    credentialId: string; // Base64URL 编码的 credentialId（唯一标识）

    @Column({ type: 'text' })
    publicKey: string; // Base64URL 编码的公钥（SPKI 格式）

    @Column({ type: 'int' })
    signCount: number; // 防重放攻击，每次签名递增

    // 是否已验证（注册时验证，登录时更新）
    @Column({ default: false })
    verified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}