/*
  Warnings:

  - A unique constraint covering the columns `[date]` on the table `HeatmapData` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "HeatmapData_userId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "HeatmapData_date_key" ON "HeatmapData"("date");
