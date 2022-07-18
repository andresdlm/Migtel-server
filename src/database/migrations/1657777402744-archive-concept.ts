import {MigrationInterface, QueryRunner} from "typeorm";

export class archiveConcept1657777402744 implements MigrationInterface {
    name = 'archiveConcept1657777402744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "archive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "archive"`);
    }

}
