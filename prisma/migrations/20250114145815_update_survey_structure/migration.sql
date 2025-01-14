-- Step 1: Add new columns as nullable
ALTER TABLE "Survey" ADD COLUMN "userId" INTEGER;
ALTER TABLE "SurveyResponse" ADD COLUMN "factor" TEXT;
ALTER TABLE "SurveyResponse" ADD COLUMN "score" INTEGER;

-- Step 2: Update existing data (you may need to adjust this based on your actual data)
UPDATE "Survey" SET "userId" = (SELECT "id" FROM "User" LIMIT 1) WHERE "userId" IS NULL;
UPDATE "SurveyResponse" SET "factor" = 'Unknown Factor', "score" = "answer" WHERE "factor" IS NULL;

-- Step 3: Make the new columns required
ALTER TABLE "Survey" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "SurveyResponse" ALTER COLUMN "factor" SET NOT NULL;
ALTER TABLE "SurveyResponse" ALTER COLUMN "score" SET NOT NULL;

-- Step 4: Remove the old 'question' and 'answer' columns from SurveyResponse
ALTER TABLE "SurveyResponse" DROP COLUMN "question";
ALTER TABLE "SurveyResponse" DROP COLUMN "answer";

-- Step 5: Create the new AverageEngagementScore table
CREATE TABLE "AverageEngagementScore" (
    "id" SERIAL NOT NULL,
    "organizationId" TEXT NOT NULL,
    "factor" TEXT NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "responseCount" INTEGER NOT NULL,
    "averageScore" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "AverageEngagementScore_pkey" PRIMARY KEY ("id")
);

-- Step 6: Add constraints and indexes
CREATE UNIQUE INDEX "AverageEngagementScore_organizationId_factor_key" ON "AverageEngagementScore"("organizationId", "factor");
CREATE INDEX "AverageEngagementScore_organizationId_idx" ON "AverageEngagementScore"("organizationId");
CREATE INDEX "Survey_organizationId_idx" ON "Survey"("organizationId");
CREATE INDEX "Survey_userId_idx" ON "Survey"("userId");
CREATE INDEX "SurveyResponse_surveyId_idx" ON "SurveyResponse"("surveyId");

-- Step 7: Add foreign key constraints
ALTER TABLE "Survey" ADD CONSTRAINT "Survey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "AverageEngagementScore" ADD CONSTRAINT "AverageEngagementScore_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

