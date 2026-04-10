/*
  Warnings:

  - You are about to drop the column `created_at` on the `HeatmapData` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `HeatmapData` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,date]` on the table `HeatmapData` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `HeatmapData` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `HeatmapData` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "HeatmapData" DROP CONSTRAINT "HeatmapData_userId_fkey";

-- AlterTable
ALTER TABLE "HeatmapData" DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "HeatmapData_userId_date_idx" ON "HeatmapData"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "HeatmapData_userId_date_key" ON "HeatmapData"("userId", "date");

-- AddForeignKey
ALTER TABLE "HeatmapData" ADD CONSTRAINT "HeatmapData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
