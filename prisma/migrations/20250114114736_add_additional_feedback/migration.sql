/*
  Warnings:

  - You are about to drop the column `status` on the `Survey` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Survey" DROP COLUMN "status",
ADD COLUMN     "additionalFeedback" TEXT;

-- DropEnum
DROP TYPE "SurveyStatus";
