import {MigrationInterface, QueryRunner} from "typeorm";

export class addRelationsBetweenEntities1651453303718 implements MigrationInterface {
    name = 'addRelationsBetweenEntities1651453303718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "client_id" TO "clientId"`);
        await queryRunner.query(`CREATE TABLE "services_client" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "clientId" integer, "servicePlanId" integer, CONSTRAINT "PK_458874e221f4ed82fa478b755d8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "concepts_invoice" ("id" SERIAL NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "invoiceInvoiceNumber" integer, "serviceClientId" integer, CONSTRAINT "PK_1a6c7297cec6aaa8ad126aa4f43" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "clientId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_16630c05fb079faeaf2e673983a" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "services_client" ADD CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_d9df936180710f9968da7cf4a51" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_3fd092932a10f358cd845ac5bec" FOREIGN KEY ("invoiceInvoiceNumber") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" ADD CONSTRAINT "FK_8fa21ae99153802f35293e25d22" FOREIGN KEY ("serviceClientId") REFERENCES "services_client"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_8fa21ae99153802f35293e25d22"`);
        await queryRunner.query(`ALTER TABLE "concepts_invoice" DROP CONSTRAINT "FK_3fd092932a10f358cd845ac5bec"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_d9df936180710f9968da7cf4a51"`);
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_e664a6cda6377f1e7cf7f27f8ac"`);
        await queryRunner.query(`ALTER TABLE "services_client" DROP CONSTRAINT "FK_16630c05fb079faeaf2e673983a"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "clientId" SET NOT NULL`);
        await queryRunner.query(`DROP TABLE "concepts_invoice"`);
        await queryRunner.query(`DROP TABLE "services_client"`);
        await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "clientId" TO "client_id"`);
    }

}
