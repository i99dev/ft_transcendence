/*
  Warnings:

  - Added the required column `type` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatRoomType" AS ENUM ('DM', 'GROUP');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "type" "ChatRoomType" NOT NULL;
