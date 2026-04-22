/*
  Warnings:

  - You are about to drop the column `courseModuleId` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `completedModules` on the `user_course_progress` table. All the data in the column will be lost.
  - You are about to drop the column `currentModuleId` on the `user_course_progress` table. All the data in the column will be lost.
  - You are about to drop the `course_modules` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_modules" DROP CONSTRAINT "course_modules_courseId_fkey";

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_courseModuleId_fkey";

-- DropForeignKey
ALTER TABLE "user_course_progress" DROP CONSTRAINT "user_course_progress_currentModuleId_fkey";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "courseModuleId",
ADD COLUMN     "courseId" INTEGER;

-- AlterTable
ALTER TABLE "user_course_progress" DROP COLUMN "completedModules",
DROP COLUMN "currentModuleId";

-- DropTable
DROP TABLE "course_modules";

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
