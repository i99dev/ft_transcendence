/*
  Warnings:

  - You are about to drop the column `userId` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `total_loses` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `total_wins` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `MatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserMatchHistory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userID]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[matchID]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `matchID` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userID` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserMatchHistory" DROP CONSTRAINT "_UserMatchHistory_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserMatchHistory" DROP CONSTRAINT "_UserMatchHistory_B_fkey";

-- DropIndex
DROP INDEX "Player_userId_key";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "userId",
ADD COLUMN     "IsWinner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "matchID" INTEGER NOT NULL,
ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "total_loses",
DROP COLUMN "total_wins";

-- DropTable
DROP TABLE "MatchHistory";

-- DropTable
DROP TABLE "_UserMatchHistory";

-- CreateTable
CREATE TABLE "Match" (
    "gameID" INTEGER NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("gameID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Match_gameID_key" ON "Match"("gameID");

-- CreateIndex
CREATE UNIQUE INDEX "Player_userID_key" ON "Player"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Player_matchID_key" ON "Player"("matchID");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userID_fkey" FOREIGN KEY ("userID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_matchID_fkey" FOREIGN KEY ("matchID") REFERENCES "Match"("gameID") ON DELETE RESTRICT ON UPDATE CASCADE;
