import {MigrationInterface, QueryRunner} from "typeorm";

export class usdInvoiceBool1652331419917 implements MigrationInterface {
    name = 'usdInvoiceBool1652331419917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ADD "usd_invoice" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "usd_invoice"`);
    }

}
