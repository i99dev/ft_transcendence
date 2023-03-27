/*
  Warnings:

  - The `type` column on the `ChatRoom` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `ChatRoomUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "chatRoomType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTETED');

-- CreateEnum
CREATE TYPE "ChatRoomUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- AlterTable
ALTER TABLE "ChatRoom" DROP COLUMN "type",
ADD COLUMN     "type" "chatRoomType" NOT NULL DEFAULT 'PUBLIC';

-- AlterTable
ALTER TABLE "ChatRoomUser" DROP COLUMN "role",
ADD COLUMN     "role" "ChatRoomUserRole" NOT NULL DEFAULT 'MEMBER';
