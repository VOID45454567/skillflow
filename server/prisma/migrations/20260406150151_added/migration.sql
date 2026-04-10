/*
  Warnings:

  - Added the required column `visibility` to the `courses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "VisibilityTypes" AS ENUM ('ORGANIZATION', 'COMMON');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "organizationId" INTEGER,
ADD COLUMN     "visibility" "VisibilityTypes" NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
