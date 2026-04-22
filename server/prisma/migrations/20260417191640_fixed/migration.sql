/*
  Warnings:

  - A unique constraint covering the columns `[userId,date]` on the table `HeatmapData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HeatmapData_date_key";

-- DropIndex
DROP INDEX "HeatmapData_userId_key";

-- AlterTable
ALTER TABLE "HeatmapData" ALTER COLUMN "date" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "HeatmapData_userId_date_key" ON "HeatmapData"("userId", "date");
