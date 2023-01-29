/*
  Warnings:

  - A unique constraint covering the columns `[friend_id]` on the table `Friend` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'OFFLINE',
ALTER COLUMN "created_at" DROP NOT NULL,
ALTER COLUMN "exp_level" DROP NOT NULL,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "last_login" DROP NOT NULL,
ALTER COLUMN "last_name" DROP NOT NULL,
ALTER COLUMN "points" DROP NOT NULL,
ALTER COLUMN "total_loses" DROP NOT NULL,
ALTER COLUMN "total_wins" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Friend_friend_id_key" ON "Friend"("friend_id");
