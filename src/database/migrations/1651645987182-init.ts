import {MigrationInterface, QueryRunner} from "typeorm";

export class init1651645987182 implements MigrationInterface {
    name = 'init1651645987182'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_concepts" ("id" SERIAL NOT NULL, "invoice_number" integer NOT NULL, "client_service_id" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "invoiceInvoiceNumber" integer, "clientServiceId" integer, CONSTRAINT "PK_f791f39b5e1375797626059beb6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("invoice_number" integer NOT NULL, "client_id" integer NOT NULL, "register_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group" integer NOT NULL, "coc" integer NOT NULL, "subtotal" real NOT NULL, "iva" real NOT NULL, "iva_r" real NOT NULL, "iva_p" real NOT NULL, "islr" real NOT NULL, "igtf" real NOT NULL, "total_amount" real NOT NULL, "exhange_rate" real NOT NULL, "comment" character varying(500) NOT NULL, "canceled" boolean NOT NULL DEFAULT false, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "clientId" integer, CONSTRAINT "PK_d8f8d3788694e1b3f96c42c36fb" PRIMARY KEY ("invoice_number"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" integer NOT NULL, "name" character varying(200) NOT NULL, "person_type" character varying(10) NOT NULL DEFAULT 'V', "document" character varying(20) NOT NULL, "address" character varying(500) NOT NULL, "retention" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_plans" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "invoice_label" character varying(100) NOT NULL, "service_plan_type" character varying(100) NOT NULL, "price" double precision NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_679a9e435f1af95a94d9749a087" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_services" ("id" SERIAL NOT NULL, "client_id" integer NOT NULL, "service_plan_id" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "clientId" integer, "servicePlanId" integer, CONSTRAINT "PK_2cb9e8bb02f240f8b95b1802383" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_51dd4967aa9c8ed6ca53e98144c" FOREIGN KEY ("invoiceInvoiceNumber") REFERENCES "invoices"("invoice_number") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_7d1eb6c7a5348da4a8f8137707e" FOREIGN KEY ("clientServiceId") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_d9df936180710f9968da7cf4a51" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_045c17e38dea1356d7e42c0eb8a" FOREIGN KEY ("clientId") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_de7c29f23207424a2f58ffd1dcb" FOREIGN KEY ("servicePlanId") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_de7c29f23207424a2f58ffd1dcb"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_045c17e38dea1356d7e42c0eb8a"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_d9df936180710f9968da7cf4a51"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_7d1eb6c7a5348da4a8f8137707e"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_51dd4967aa9c8ed6ca53e98144c"`);
        await queryRunner.query(`DROP TABLE "client_services"`);
        await queryRunner.query(`DROP TABLE "service_plans"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "invoice_concepts"`);
    }

}
