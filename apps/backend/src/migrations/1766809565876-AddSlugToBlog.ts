import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToBlog1766809565876 implements MigrationInterface {
    name = 'AddSlugToBlog1766809565876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" ADD "slug" character varying`);
        await queryRunner.query(`ALTER TABLE "blog" ADD CONSTRAINT "UQ_0dc7e58d73a1390874a663bd599" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog" DROP CONSTRAINT "UQ_0dc7e58d73a1390874a663bd599"`);
        await queryRunner.query(`ALTER TABLE "blog" DROP COLUMN "slug"`);
    }

}
