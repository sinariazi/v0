-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "trialEndDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP + INTERVAL '3 months';

-- Update existing rows
UPDATE "Organization" SET "trialEndDate" = CURRENT_TIMESTAMP + INTERVAL '3 months' WHERE "trialEndDate" IS NULL;

-- Remove the default constraint
ALTER TABLE "Organization" ALTER COLUMN "trialEndDate" DROP DEFAULT;

