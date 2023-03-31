-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('NORMAL', 'SPECIAL');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "type" "MessageType" NOT NULL DEFAULT 'NORMAL';
