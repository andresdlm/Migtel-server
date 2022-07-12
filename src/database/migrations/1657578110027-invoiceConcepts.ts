import {MigrationInterface, QueryRunner} from "typeorm";

export class invoiceConcepts1657578110027 implements MigrationInterface {
    name = 'invoiceConcepts1657578110027'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "FK_39248c98849c6530945d31b4ccd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_39248c98849c6530945d31b4cc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caf88ab4d0d35faf6e1828447a"`);
        await queryRunner.query(`CREATE TABLE "invoice_services" ("invoice_number" integer NOT NULL, "client_service_id" integer NOT NULL, CONSTRAINT "PK_1dc8c6faf574d11083f32adb3cb" PRIMARY KEY ("invoice_number", "client_service_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5558f76e02a6da10b43ebfe822" ON "invoice_services" ("invoice_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_b9303a36ec3215c889049813ff" ON "invoice_services" ("client_service_id") `);
        await queryRunner.query(`CREATE TABLE "invoice_concept_relation" ("invoice_number" integer NOT NULL, "invoice_concept_id" integer NOT NULL, CONSTRAINT "PK_ae0b3180db5032aae0b24934f13" PRIMARY KEY ("invoice_number", "invoice_concept_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4ef491979a5f6b30c493d6f823" ON "invoice_concept_relation" ("invoice_number") `);
        await queryRunner.query(`CREATE INDEX "IDX_3748a738afe166de7406845d26" ON "invoice_concept_relation" ("invoice_concept_id") `);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "PK_040c25811c444b1c0a03cda32e7"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "PK_caf88ab4d0d35faf6e1828447a9" PRIMARY KEY ("client_service_id")`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "invoice_number"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "PK_caf88ab4d0d35faf6e1828447a9"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "client_service_id"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "PK_f791f39b5e1375797626059beb6" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "invoice_description" character varying(500) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "price" real NOT NULL`);
        await queryRunner.query(`CREATE SEQUENCE IF NOT EXISTS "invoices_id_seq" OWNED BY "invoices"."id"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" SET DEFAULT nextval('"invoices_id_seq"')`);
        await queryRunner.query(`ALTER TABLE "invoice_services" ADD CONSTRAINT "FK_5558f76e02a6da10b43ebfe8224" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invoice_services" ADD CONSTRAINT "FK_b9303a36ec3215c889049813ffe" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "invoice_concept_relation" ADD CONSTRAINT "FK_4ef491979a5f6b30c493d6f823b" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invoice_concept_relation" ADD CONSTRAINT "FK_3748a738afe166de7406845d266" FOREIGN KEY ("invoice_concept_id") REFERENCES "invoice_concepts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concept_relation" DROP CONSTRAINT "FK_3748a738afe166de7406845d266"`);
        await queryRunner.query(`ALTER TABLE "invoice_concept_relation" DROP CONSTRAINT "FK_4ef491979a5f6b30c493d6f823b"`);
        await queryRunner.query(`ALTER TABLE "invoice_services" DROP CONSTRAINT "FK_b9303a36ec3215c889049813ffe"`);
        await queryRunner.query(`ALTER TABLE "invoice_services" DROP CONSTRAINT "FK_5558f76e02a6da10b43ebfe8224"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "id" DROP DEFAULT`);
        await queryRunner.query(`DROP SEQUENCE "invoices_id_seq"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "invoice_description"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "PK_f791f39b5e1375797626059beb6"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "client_service_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "PK_caf88ab4d0d35faf6e1828447a9" PRIMARY KEY ("client_service_id")`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD "invoice_number" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" DROP CONSTRAINT "PK_caf88ab4d0d35faf6e1828447a9"`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "PK_040c25811c444b1c0a03cda32e7" PRIMARY KEY ("invoice_number", "client_service_id")`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3748a738afe166de7406845d26"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ef491979a5f6b30c493d6f823"`);
        await queryRunner.query(`DROP TABLE "invoice_concept_relation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b9303a36ec3215c889049813ff"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5558f76e02a6da10b43ebfe822"`);
        await queryRunner.query(`DROP TABLE "invoice_services"`);
        await queryRunner.query(`CREATE INDEX "IDX_caf88ab4d0d35faf6e1828447a" ON "invoice_concepts" ("client_service_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_39248c98849c6530945d31b4cc" ON "invoice_concepts" ("invoice_number") `);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_39248c98849c6530945d31b4ccd" FOREIGN KEY ("invoice_number") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "invoice_concepts" ADD CONSTRAINT "FK_caf88ab4d0d35faf6e1828447a9" FOREIGN KEY ("client_service_id") REFERENCES "client_services"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
