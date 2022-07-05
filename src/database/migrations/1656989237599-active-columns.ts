import {MigrationInterface, QueryRunner} from "typeorm";

export class activeColumns1656989237599 implements MigrationInterface {
    name = 'activeColumns1656989237599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "archived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "archived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "service_plans" ADD "archived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD "archived" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_39248c98849c6530945d31b4ccd"`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "invoices_id_seq" OWNED BY "invoices"."id"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" SET DEFAULT nextval('"invoices_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "phone" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_39248c98849c6530945d31b4ccd" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_39248c98849c6530945d31b4ccd"`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "phone" SET DEFAULT '123456789'`);
        await queryRunner.query(`ALTER TABLE "clients" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" SET DEFAULT nextval('invoices_invoice_number_seq')`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "invoices_id_seq"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_39248c98849c6530945d31b4ccd" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP COLUMN "archived"`);
        await queryRunner.query(`ALTER TABLE "service_plans" DROP COLUMN "archived"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "archived"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "archived"`);
    }

}
