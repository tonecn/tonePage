import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@Index('IDX_SMS_PHONE_TYPE', ['phone', 'type'])
@Index('IDX_SMS_EXPIRED', ['expiredAt'])
export class SmsRecord {
    @PrimaryGeneratedColumn('identity')
    id: number;

    @Column()
    phone: string;

    @Column()
    type: string;

    @Column()
    code: string;

    @Column({ type: 'smallint', default: 0 })
    tryCount: number;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @Column({ type: 'timestamp with time zone', precision: 3 })
    expiredAt: Date;

    @Column({ type: 'timestamp with time zone', precision: 3, nullable: true })
    usedAt: Date;
}