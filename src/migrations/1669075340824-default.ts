import { MigrationInterface, QueryRunner } from "typeorm";

export class default1669075340824 implements MigrationInterface {
    name = 'default1669075340824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departments" ("iddepartment" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_d35000c3b9e683361fa4a3d78ad" PRIMARY KEY ("iddepartment"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_profile_enum" AS ENUM('employee', 'manager', 'admin')`);
        await queryRunner.query(`CREATE TABLE "users" ("iduser" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "mail" character varying(50) NOT NULL, "password" character varying NOT NULL, "profile" "public"."users_profile_enum" NOT NULL DEFAULT 'employee', "idmaster" integer, CONSTRAINT "PK_368f433c013b3358af133cde132" PRIMARY KEY ("iduser"))`);
        await queryRunner.query(`CREATE TABLE "works" ("iddepartment" integer NOT NULL, "iduser" integer NOT NULL, CONSTRAINT "PK_8b57b0ab70fae3ed58fc8a54318" PRIMARY KEY ("iddepartment", "iduser"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55983d7c98dfbc4b487fd0ebb1" ON "works" ("iddepartment") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd5c489b8c7f4f5c043180e405" ON "works" ("iduser") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "fk_master_id" FOREIGN KEY ("idmaster") REFERENCES "users"("iduser") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "works" ADD CONSTRAINT "FK_55983d7c98dfbc4b487fd0ebb17" FOREIGN KEY ("iddepartment") REFERENCES "departments"("iddepartment") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "works" ADD CONSTRAINT "FK_cd5c489b8c7f4f5c043180e405e" FOREIGN KEY ("iduser") REFERENCES "users"("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "works" DROP CONSTRAINT "FK_cd5c489b8c7f4f5c043180e405e"`);
        await queryRunner.query(`ALTER TABLE "works" DROP CONSTRAINT "FK_55983d7c98dfbc4b487fd0ebb17"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "fk_master_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd5c489b8c7f4f5c043180e405"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_55983d7c98dfbc4b487fd0ebb1"`);
        await queryRunner.query(`DROP TABLE "works"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_profile_enum"`);
        await queryRunner.query(`DROP TABLE "departments"`);
    }

}
