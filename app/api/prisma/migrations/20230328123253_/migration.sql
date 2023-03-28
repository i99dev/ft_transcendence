/*
  Warnings:

  - The values [PROTETED] on the enum `chatType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "chatType_new" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED');
ALTER TABLE "Chat" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "Chat" ALTER COLUMN "type" TYPE "chatType_new" USING ("type"::text::"chatType_new");
ALTER TYPE "chatType" RENAME TO "chatType_old";
ALTER TYPE "chatType_new" RENAME TO "chatType";
DROP TYPE "chatType_old";
ALTER TABLE "Chat" ALTER COLUMN "type" SET DEFAULT 'PUBLIC';
COMMIT;
