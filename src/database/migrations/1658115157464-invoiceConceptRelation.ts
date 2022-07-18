import {MigrationInterface, QueryRunner} from "typeorm";

export class invoiceConceptRelation1658115157464 implements MigrationInterface {
    name = 'invoiceConceptRelation1658115157464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" ADD CONSTRAINT "FK_484db72effc91e3473fe6dde09b" FOREIGN KEY ("invoice_concept_id") REFERENCES "invoice_concepts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoice_concepts_relation" DROP CONSTRAINT "FK_484db72effc91e3473fe6dde09b"`);
    }

}
