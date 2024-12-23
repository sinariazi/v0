/*
  Warnings:

  - You are about to drop the column `confirmationStatus` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('UNCONFIRMED', 'CONFIRMED', 'ARCHIVED', 'COMPROMISED', 'UNKNOWN', 'RESET_REQUIRED', 'FORCE_CHANGE_PASSWORD');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "confirmationStatus",
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'UNCONFIRMED';
