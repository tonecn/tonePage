//
import { MigrationInterface, QueryRunner } from "typeorm";
export class AddContentToBlog1769414400000 implements MigrationInterface {
    name = 'AddContentToBlog1769414400000'
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "content" text`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "contentUrl"`);
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "contentUrl" character varying NOT NULL DEFAULT ''`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "content"`);
    }
}