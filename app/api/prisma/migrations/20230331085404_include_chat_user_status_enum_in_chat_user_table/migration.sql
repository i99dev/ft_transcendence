/*
  Warnings:

  - The `status` column on the `ChatUser` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ChatUser" DROP COLUMN "status",
ADD COLUMN     "status" "ChatUserStatus" NOT NULL DEFAULT 'NORMAL';
