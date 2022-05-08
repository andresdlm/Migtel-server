import {MigrationInterface, QueryRunner} from "typeorm";

export class cityEnClientes1651977798587 implements MigrationInterface {
    name = 'cityEnClientes1651977798587'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" ADD "city" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "city"`);
    }

}
