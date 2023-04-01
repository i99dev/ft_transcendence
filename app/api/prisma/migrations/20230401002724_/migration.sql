/*
  Warnings:

  - Made the column `type` on table `ChatRoom` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChatRoom" ALTER COLUMN "type" SET NOT NULL;
