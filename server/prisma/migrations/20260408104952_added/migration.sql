/*
  Warnings:

  - Added the required column `text` to the `Appeal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appeal" ADD COLUMN     "text" TEXT NOT NULL;
