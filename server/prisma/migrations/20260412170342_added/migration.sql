/*
  Warnings:

  - The values [COMMON] on the enum `VisibilityTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "VisibilityTypes_new" AS ENUM ('ORGANIZATION', 'PUBLISHED', 'DRAFT');
ALTER TABLE "courses" ALTER COLUMN "visibility" TYPE "VisibilityTypes_new" USING ("visibility"::text::"VisibilityTypes_new");
ALTER TYPE "VisibilityTypes" RENAME TO "VisibilityTypes_old";
ALTER TYPE "VisibilityTypes_new" RENAME TO "VisibilityTypes";
DROP TYPE "VisibilityTypes_old";
COMMIT;
