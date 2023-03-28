-- CreateEnum
CREATE TYPE "chatType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTETED');

-- CreateEnum
CREATE TYPE "ChatUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "Chat" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "type" "chatType" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" SERIAL NOT NULL,
    "role" "ChatUserRole" NOT NULL DEFAULT 'MEMBER',
    "status" TEXT NOT NULL DEFAULT 'default',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_login" TEXT NOT NULL,
    "chat_room_id" TEXT NOT NULL,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_room_id" TEXT NOT NULL,
    "sender_login" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chat_room_id_key" ON "Chat"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_chat_room_id_user_login_key" ON "ChatUser"("chat_room_id", "user_login");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "Chat"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_user_login_fkey" FOREIGN KEY ("user_login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "Chat"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_login_fkey" FOREIGN KEY ("sender_login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;
