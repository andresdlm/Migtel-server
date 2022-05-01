/* eslint-disable prettier/prettier */
import {MigrationInterface, QueryRunner} from "typeorm";

export class init1651386166053 implements MigrationInterface {
    name = 'init1651386166053'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" integer NOT NULL, "name" character varying(200) NOT NULL, "person_type" character varying(10) NOT NULL DEFAULT 'V', "document" character varying(20) NOT NULL, "address" character varying(500) NOT NULL, "retention" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "invoices" ("invoice_number" integer NOT NULL, "client_id" integer NOT NULL, "register_date" TIMESTAMP NOT NULL DEFAULT now(), "group" integer NOT NULL, "coc" integer NOT NULL, "subtotal" real NOT NULL, "iva" real NOT NULL, "iva_r" real NOT NULL, "iva_p" real NOT NULL, "islr" real NOT NULL, "igtf" real NOT NULL, "total_amount" real NOT NULL, "exhange_rate" real NOT NULL, "comment" character varying(500) NOT NULL, "canceled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_d8f8d3788694e1b3f96c42c36fb" PRIMARY KEY ("invoice_number"))`);
        await queryRunner.query(`CREATE TABLE "service_plans" ("id" integer NOT NULL, "name" character varying(100) NOT NULL, "invoiceLabel" character varying(100) NOT NULL, "servicePlanType" character varying(100) NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_679a9e435f1af95a94d9749a087" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "service_plans"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
