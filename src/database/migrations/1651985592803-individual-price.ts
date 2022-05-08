import {MigrationInterface, QueryRunner} from "typeorm";

export class individualPrice1651985592803 implements MigrationInterface {
    name = 'individualPrice1651985592803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_services" ADD "has_individual_price" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "client_services" ADD "individual_price" real NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "client_services" DROP COLUMN "individual_price"`);
        await queryRunner.query(`ALTER TABLE "client_services" DROP COLUMN "has_individual_price"`);
    }

}
