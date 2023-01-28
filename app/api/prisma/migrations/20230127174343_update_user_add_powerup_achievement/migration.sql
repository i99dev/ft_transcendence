/*
  Warnings:

  - Made the column `created_at` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `exp_level` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_login` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `points` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_loses` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_wins` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "two_fac_auth" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "exp_level" SET NOT NULL,
ALTER COLUMN "first_name" DROP DEFAULT,
ALTER COLUMN "last_login" SET NOT NULL,
ALTER COLUMN "last_name" DROP DEFAULT,
ALTER COLUMN "login" DROP DEFAULT,
ALTER COLUMN "points" SET NOT NULL,
ALTER COLUMN "total_loses" SET NOT NULL,
ALTER COLUMN "total_wins" SET NOT NULL;

-- CreateTable
CREATE TABLE "PowerUp" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "period" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PowerUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "type" INTEGER NOT NULL,
    "points" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PowerUp_type_key" ON "PowerUp"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_type_key" ON "Achievement"("type");
