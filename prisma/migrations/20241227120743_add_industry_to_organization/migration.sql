/*
  Warnings:

  - Added the required column `city` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `industry` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Organization` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "industry" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;
