import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldsCreateUpdate1651387152820 implements MigrationInterface {
    name = 'addFieldsCreateUpdate1651387152820'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "service_plans" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "service_plans" ADD "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "service_plans" ADD "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "register_date"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "register_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "register_date"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "register_date" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "service_plans" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "service_plans" DROP COLUMN "create_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "update_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "create_at"`);
        await queryRunner.query(`ALTER TABLE "service_plans" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
