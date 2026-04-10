/*
  Warnings:

  - A unique constraint covering the columns `[banInfoId]` on the table `Appeal` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `banInfoId` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appeal" ADD COLUMN     "banInfoId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "block_info" ADD COLUMN     "appealId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Appeal_banInfoId_key" ON "Appeal"("banInfoId");

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_banInfoId_fkey" FOREIGN KEY ("banInfoId") REFERENCES "block_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
