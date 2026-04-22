-- DropForeignKey
ALTER TABLE "Appeal" DROP CONSTRAINT "Appeal_banInfoId_fkey";

-- AlterTable
ALTER TABLE "Appeal" ALTER COLUMN "banInfoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_banInfoId_fkey" FOREIGN KEY ("banInfoId") REFERENCES "block_info"("id") ON DELETE SET NULL ON UPDATE CASCADE;
