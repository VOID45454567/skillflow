-- DropForeignKey
ALTER TABLE "Appeal" DROP CONSTRAINT "Appeal_userId_fkey";

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
