-- DropForeignKey
ALTER TABLE "Appeal" DROP CONSTRAINT "Appeal_userId_fkey";

-- AlterTable
ALTER TABLE "Appeal" ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
