import {MigrationInterface, QueryRunner} from "typeorm";

export class foreingKeysFixed1651719967930 implements MigrationInterface {
    name = 'foreingKeysFixed1651719967930'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_045c17e38dea1356d7e42c0eb8a"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_de7c29f23207424a2f58ffd1dcb"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_d9df936180710f9968da7cf4a51"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_51dd4967aa9c8ed6ca53e98144c"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_7d1eb6c7a5348da4a8f8137707e"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP COLUMN "servicePlanId"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "clientId"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "invoiceInvoiceNumber"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "clientServiceId"`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_86cffe7d21594d82c9e09d42ab6" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_996ed101d79a2dc920184132939" FOREIGN KEY ("service_plan_id") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_39248c98849c6530945d31b4ccd" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_39248c98849c6530945d31b4ccd"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_996ed101d79a2dc920184132939"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_86cffe7d21594d82c9e09d42ab6"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "clientServiceId" integer`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "invoiceInvoiceNumber" integer`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "clientId" integer`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD "servicePlanId" integer`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD "clientId" integer`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_7d1eb6c7a5348da4a8f8137707e" FOREIGN KEY ("clientServiceId") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_51dd4967aa9c8ed6ca53e98144c" FOREIGN KEY ("invoiceInvoiceNumber") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_d9df936180710f9968da7cf4a51" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_de7c29f23207424a2f58ffd1dcb" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_045c17e38dea1356d7e42c0eb8a" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
