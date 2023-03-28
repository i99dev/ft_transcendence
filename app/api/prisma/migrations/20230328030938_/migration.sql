/*
  Warnings:

  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_matchID_fkey";

-- AlterTable
ALTER TABLE "Match" DROP CONSTRAINT "Match_pkey",
ALTER COLUMN "gameID" SET DATA TYPE TEXT,
ADD CONSTRAINT "Match_pkey" PRIMARY KEY ("gameID");

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "matchID" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_matchID_fkey" FOREIGN KEY ("matchID") REFERENCES "Match"("gameID") ON DELETE RESTRICT ON UPDATE CASCADE;
