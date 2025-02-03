/*
  Warnings:

  - Added the required column `engagementScore` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question1Score` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question2Score` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `question3Score` to the `Survey` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surveyDate` to the `Survey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "engagementScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "question1Score" INTEGER NOT NULL,
ADD COLUMN     "question2Score" INTEGER NOT NULL,
ADD COLUMN     "question3Score" INTEGER NOT NULL,
ADD COLUMN     "surveyDate" TIMESTAMP(3) NOT NULL;
ALTER TABLE "Survey" ALTER COLUMN "engagementScore" DROP NOT NULL;
-- Update existing null values with a default value if needed
UPDATE "Survey" SET "engagementScore" = 0 WHERE "engagementScore" IS NULL;