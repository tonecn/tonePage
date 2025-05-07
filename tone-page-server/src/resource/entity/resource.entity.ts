import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from "typeorm";

type ResourceTag = {
    name: string;
    description: string;
}

@Entity()
export class Resource {
    @PrimaryColumn('uuid', { unique: true, default: () => 'gen_random_uuid()' })
    @Index({ unique: true })
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

    @Column()
    isHidden: boolean;

    @CreateDateColumn({ precision: 3 })
    createdAt: Date;

    @UpdateDateColumn({ precision: 3 })
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true, precision: 3 })
    deletedAt: Date;
}