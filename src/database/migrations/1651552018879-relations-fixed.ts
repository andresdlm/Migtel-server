import {MigrationInterface, QueryRunner} from "typeorm";

export class relationsFixed1651552018879 implements MigrationInterface {
    name = 'relationsFixed1651552018879'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_16630c05fb079faeaf2e673983a"`);
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac"`);
        await queryRunner.query(`ALTER TABLE "services_client" ALTER COLUMN "clientId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services_client" ALTER COLUMN "servicePlanId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_3fd092932a10f358cd845ac5bec"`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_8fa21ae99153802f35293e25d22"`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ALTER COLUMN "invoiceInvoiceNumber" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ALTER COLUMN "serviceClientId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_16630c05fb079faeaf2e673983a" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_3fd092932a10f358cd845ac5bec" FOREIGN KEY ("invoiceInvoiceNumber") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_8fa21ae99153802f35293e25d22" FOREIGN KEY ("serviceClientId") REFERENCES "services_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_8fa21ae99153802f35293e25d22"`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_3fd092932a10f358cd845ac5bec"`);
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac"`);
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_16630c05fb079faeaf2e673983a"`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ALTER COLUMN "serviceClientId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ALTER COLUMN "invoiceInvoiceNumber" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_8fa21ae99153802f35293e25d22" FOREIGN KEY ("serviceClientId") REFERENCES "services_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_3fd092932a10f358cd845ac5bec" FOREIGN KEY ("invoiceInvoiceNumber") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_client" ALTER COLUMN "servicePlanId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services_client" ALTER COLUMN "clientId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_16630c05fb079faeaf2e673983a" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
