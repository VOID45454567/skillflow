/*
  Warnings:

  - You are about to drop the column `day` on the `HeatmapData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "HeatmapData" DROP CONSTRAINT "HeatmapData_userId_fkey";

-- AlterTable
ALTER TABLE "HeatmapData" DROP COLUMN "day",
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "HeatmapData" ADD CONSTRAINT "HeatmapData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
