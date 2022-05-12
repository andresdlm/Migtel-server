import {MigrationInterface, QueryRunner} from "typeorm";

export class init1652321586320 implements MigrationInterface {
    name = 'init1652321586320'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" character varying NOT NULL, "name" character varying(200) NOT NULL, "coc" integer NOT NULL, "has_igtf" boolean NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("invoice_number" integer NOT NULL, "client_id" integer NOT NULL, "register_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "group" integer NOT NULL, "payment_method_id" character varying NOT NULL, "subtotal" real NOT NULL, "iva" real NOT NULL, "iva_r" real NOT NULL, "iva_p" real NOT NULL, "islr" real NOT NULL, "igtf" real NOT NULL, "total_amount" real NOT NULL, "exhange_rate" real NOT NULL, "comment" character varying(500) NOT NULL, "canceled" boolean NOT NULL DEFAULT false, "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_d8f8d3788694e1b3f96c42c36fb" PRIMARY KEY ("invoice_number"))`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" integer NOT NULL, "name" character varying(200) NOT NULL, "person_type" character varying(10) NOT NULL DEFAULT 'V', "document" character varying(20) NOT NULL, "address" character varying(500) NOT NULL, "city" character varying(100) NOT NULL, "retention" integer NOT NULL, "has_islr" boolean NOT NULL, "amount_islr" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "service_plans" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "invoice_label" character varying(100) NOT NULL, "service_plan_type" character varying(100) NOT NULL, "price" double precision NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_679a9e435f1af95a94d9749a087" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "client_services" ("id" SERIAL NOT NULL, "client_id" integer NOT NULL, "service_plan_id" integer NOT NULL, "has_individual_price" boolean NOT NULL, "individual_price" real NOT NULL DEFAULT '0', "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2cb9e8bb02f240f8b95b1802383" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoice_concepts" ("invoice_number" integer NOT NULL, "client_service_id" integer NOT NULL, CONSTRAINT "PK_040c25811c444b1c0a03cda32e7" PRIMARY KEY ("invoice_number", "client_service_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_39248c98849c6530945d31b4cc" ON "invoice_concepts" ("invoice_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_caf88ab4d0d35faf6e1828447a" ON "invoice_concepts" ("client_service_id") `);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_86cffe7d21594d82c9e09d42ab6" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD CONSTRAINT "FK_996ed101d79a2dc920184132939" FOREIGN KEY ("service_plan_id") REFERENCES "service_plans"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_39248c98849c6530945d31b4ccd" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("invoice_number") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_39248c98849c6530945d31b4ccd"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_996ed101d79a2dc920184132939"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP CONSTRAINT "FK_86cffe7d21594d82c9e09d42ab6"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_5534ba11e10f1a9953cbdaabf16"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caf88ab4d0d35faf6e1828447a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39248c98849c6530945d31b4cc"`);
        await queryRunner.query(`DROP TABLE "invoice_concepts"`);
        await queryRunner.query(`DROP TABLE "client_services"`);
        await queryRunner.query(`DROP TABLE "service_plans"`);
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
