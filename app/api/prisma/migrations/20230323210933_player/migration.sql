/*
  Warnings:

  - You are about to drop the column `opponentId` on the `MatchHistory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "MatchHistory" DROP CONSTRAINT "MatchHistory_opponentId_fkey";

-- AlterTable
ALTER TABLE "MatchHistory" DROP COLUMN "opponentId";

-- CreateTable
CREATE TABLE "_UserMatchHistory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserMatchHistory_AB_unique" ON "_UserMatchHistory"("A", "B");

-- CreateIndex
CREATE INDEX "_UserMatchHistory_B_index" ON "_UserMatchHistory"("B");

-- AddForeignKey
ALTER TABLE "_UserMatchHistory" ADD CONSTRAINT "_UserMatchHistory_A_fkey" FOREIGN KEY ("A") REFERENCES "MatchHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserMatchHistory" ADD CONSTRAINT "_UserMatchHistory_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
