-- CreateEnum
CREATE TYPE "SurveyStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Survey" ADD COLUMN     "status" "SurveyStatus" NOT NULL DEFAULT 'ACTIVE';
