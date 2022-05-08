import {MigrationInterface, QueryRunner} from "typeorm";

export class actualizacionDeModelo1651975486816 implements MigrationInterface {
    name = 'actualizacionDeModelo1651975486816'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" character varying NOT NULL, "name" character varying(200) NOT NULL, "coc" integer NOT NULL, "create_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "update_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment_methods"`);
    }

}
