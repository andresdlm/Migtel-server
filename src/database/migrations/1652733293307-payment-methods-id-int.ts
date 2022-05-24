import {MigrationInterface, QueryRunner} from "typeorm";

export class paymentMethodsIdInt1652733293307 implements MigrationInterface {
    name = 'paymentMethodsIdInt1652733293307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "payment_method_id"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "payment_method_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4"`);
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "payment_method_id"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "payment_method_id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "id" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_ad61671b08c0812c0fa0f21a7f4" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
