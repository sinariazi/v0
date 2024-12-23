-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- AlterTable
ALTER TABLE "User" 
ADD COLUMN "family" TEXT NOT NULL DEFAULT '',
ADD COLUMN "gender" "Gender" NOT NULL DEFAULT 'OTHER',
ADD COLUMN "team" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "family" DROP DEFAULT,
                   ALTER COLUMN "gender" DROP DEFAULT;

