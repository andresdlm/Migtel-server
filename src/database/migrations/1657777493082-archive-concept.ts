import {MigrationInterface, QueryRunner} from "typeorm";

export class archiveConcept1657777493082 implements MigrationInterface {
    name = 'archiveConcept1657777493082'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ALTER COLUMN "archive" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ALTER COLUMN "archive" SET DEFAULT true`);
    }

}
