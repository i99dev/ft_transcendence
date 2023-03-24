/*
  Warnings:

  - You are about to drop the column `isWinner` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `my_score` on the `MatchHistory` table. All the data in the column will be lost.
  - You are about to drop the column `op_score` on the `MatchHistory` table. All the data in the column will be lost.
  - Added the required column `winnerID` to the `MatchHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "isWinner",
DROP COLUMN "my_score",
DROP COLUMN "op_score",
ADD COLUMN     "score" INTEGER[],
ADD COLUMN     "winnerID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_userId_key" ON "Player"("userId");
