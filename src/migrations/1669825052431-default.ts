import { MigrationInterface, QueryRunner } from "typeorm";

export class default1669825052431 implements MigrationInterface {
    name = 'default1669825052431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "departments" ("iddepartment" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "users" ("iduser" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "mail" varchar(50) NOT NULL, "password" varchar NOT NULL, "profile" varchar NOT NULL DEFAULT ('employee'), "idmaster" integer)`);
        await queryRunner.query(`CREATE TABLE "works" ("iddepartment" integer NOT NULL, "iduser" integer NOT NULL, PRIMARY KEY ("iddepartment", "iduser"))`);
        await queryRunner.query(`CREATE INDEX "IDX_55983d7c98dfbc4b487fd0ebb1" ON "works" ("iddepartment") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd5c489b8c7f4f5c043180e405" ON "works" ("iduser") `);
        await queryRunner.query(`CREATE TABLE "temporary_users" ("iduser" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "mail" varchar(50) NOT NULL, "password" varchar NOT NULL, "profile" varchar NOT NULL DEFAULT ('employee'), "idmaster" integer, CONSTRAINT "fk_master_id" FOREIGN KEY ("idmaster") REFERENCES "users" ("iduser") ON DELETE CASCADE ON UPDATE CASCADE)`);
        await queryRunner.query(`INSERT INTO "temporary_users"("iduser", "name", "mail", "password", "profile", "idmaster") SELECT "iduser", "name", "mail", "password", "profile", "idmaster" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
        await queryRunner.query(`DROP INDEX "IDX_55983d7c98dfbc4b487fd0ebb1"`);
        await queryRunner.query(`DROP INDEX "IDX_cd5c489b8c7f4f5c043180e405"`);
        await queryRunner.query(`CREATE TABLE "temporary_works" ("iddepartment" integer NOT NULL, "iduser" integer NOT NULL, CONSTRAINT "FK_55983d7c98dfbc4b487fd0ebb17" FOREIGN KEY ("iddepartment") REFERENCES "departments" ("iddepartment") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_cd5c489b8c7f4f5c043180e405e" FOREIGN KEY ("iduser") REFERENCES "users" ("iduser") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("iddepartment", "iduser"))`);
        await queryRunner.query(`INSERT INTO "temporary_works"("iddepartment", "iduser") SELECT "iddepartment", "iduser" FROM "works"`);
        await queryRunner.query(`DROP TABLE "works"`);
        await queryRunner.query(`ALTER TABLE "temporary_works" RENAME TO "works"`);
        await queryRunner.query(`CREATE INDEX "IDX_55983d7c98dfbc4b487fd0ebb1" ON "works" ("iddepartment") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd5c489b8c7f4f5c043180e405" ON "works" ("iduser") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_cd5c489b8c7f4f5c043180e405"`);
        await queryRunner.query(`DROP INDEX "IDX_55983d7c98dfbc4b487fd0ebb1"`);
        await queryRunner.query(`ALTER TABLE "works" RENAME TO "temporary_works"`);
        await queryRunner.query(`CREATE TABLE "works" ("iddepartment" integer NOT NULL, "iduser" integer NOT NULL, PRIMARY KEY ("iddepartment", "iduser"))`);
        await queryRunner.query(`INSERT INTO "works"("iddepartment", "iduser") SELECT "iddepartment", "iduser" FROM "temporary_works"`);
        await queryRunner.query(`DROP TABLE "temporary_works"`);
        await queryRunner.query(`CREATE INDEX "IDX_cd5c489b8c7f4f5c043180e405" ON "works" ("iduser") `);
        await queryRunner.query(`CREATE INDEX "IDX_55983d7c98dfbc4b487fd0ebb1" ON "works" ("iddepartment") `);
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("iduser" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(50) NOT NULL, "mail" varchar(50) NOT NULL, "password" varchar NOT NULL, "profile" varchar NOT NULL DEFAULT ('employee'), "idmaster" integer)`);
        await queryRunner.query(`INSERT INTO "users"("iduser", "name", "mail", "password", "profile", "idmaster") SELECT "iduser", "name", "mail", "password", "profile", "idmaster" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
        await queryRunner.query(`DROP INDEX "IDX_cd5c489b8c7f4f5c043180e405"`);
        await queryRunner.query(`DROP INDEX "IDX_55983d7c98dfbc4b487fd0ebb1"`);
        await queryRunner.query(`DROP TABLE "works"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "departments"`);
    }

}
