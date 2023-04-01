/*
  Warnings:

  - Added the required column `type` to the `ChatRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "roomType" AS ENUM ('DM', 'GROUP');

-- AlterTable
ALTER TABLE "ChatRoom" ADD COLUMN     "type" "roomType" NOT NULL;
