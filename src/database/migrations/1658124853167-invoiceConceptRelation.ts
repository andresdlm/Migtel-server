import {MigrationInterface, QueryRunner} from "typeorm";

export class invoiceConceptRelation1658124853167 implements MigrationInterface {
    name = 'invoiceConceptRelation1658124853167'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invoice_concepts_relation" ("count" integer NOT NULL, "invoice_id" integer NOT NULL, "invoice_concept_id" integer NOT NULL, CONSTRAINT "PK_19acdf24243d9b47dfb609c67ba" PRIMARY KEY ("invoice_id", "invoice_concept_id"))`);
        await queryRunner.query(`CREATE TABLE "invoice_services" ("count" integer NOT NULL, "invoice_id" integer NOT NULL, "client_service_id" integer NOT NULL, CONSTRAINT "PK_ab242f59df497f40e5eb463a418" PRIMARY KEY ("invoice_id", "client_service_id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "invoice_number" integer NOT NULL, "client_id" integer NOT NULL, "register_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "payment_method_id" integer NOT NULL, "subtotal" real NOT NULL, "iva" real NOT NULL, "iva_r" real NOT NULL, "iva_p" real NOT NULL, "islr" real NOT NULL, "igtf" real NOT NULL, "total_amount" real NOT NULL, "exhange_rate" real NOT NULL, "comment" character varying(500) NOT NULL, "usd_invoice" boolean NOT NULL DEFAULT false, "canceled" boolean NOT NULL DEFAULT false, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" ADD CONSTRAINT "FK_468fa4b8cb2c3c5585f83b94034" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" ADD CONSTRAINT "FK_484db72effc91e3473fe6dde09b" FOREIGN KEY ("invoice_concept_id") REFERENCES "invoice_concepts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_services" ADD CONSTRAINT "FK_e6ddb287d26d29363358e240adf" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_services" ADD CONSTRAINT "FK_b9303a36ec3215c889049813ffe" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16"`);
        await queryRunner.query(`ALTER TABLE "invoice_services" DROP CONSTRAINT "FK_b9303a36ec3215c889049813ffe"`);
        await queryRunner.query(`ALTER TABLE "invoice_services" DROP CONSTRAINT "FK_e6ddb287d26d29363358e240adf"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" DROP CONSTRAINT "FK_484db72effc91e3473fe6dde09b"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" DROP CONSTRAINT "FK_468fa4b8cb2c3c5585f83b94034"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "invoice_services"`);
        await queryRunner.query(`DROP TABLE "invoice_concepts_relation"`);
    }

}
