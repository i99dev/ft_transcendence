-- CreateEnum
CREATE TYPE "chatType" AS ENUM ('PUBLIC', 'PRIVATE', 'PROTECTED', 'DIRECT');

-- CreateEnum
CREATE TYPE "ChatUserRole" AS ENUM ('OWNER', 'ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" SERIAL NOT NULL,
    "room_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DirectChat" (
    "id" SERIAL NOT NULL,
    "chat_room_id" TEXT NOT NULL,

    CONSTRAINT "DirectChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupChat" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "type" "chatType" NOT NULL DEFAULT 'PUBLIC',
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chat_room_id" TEXT NOT NULL,

    CONSTRAINT "GroupChat_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "_DirectChatUsers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_room_id_key" ON "ChatRoom"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "DirectChat_chat_room_id_key" ON "DirectChat"("chat_room_id");

-- CreateIndex
CREATE UNIQUE INDEX "GroupChat_chat_room_id_key" ON "GroupChat"("chat_room_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_chat_room_id_user_login_key" ON "ChatUser"("chat_room_id", "user_login");

-- CreateIndex
CREATE UNIQUE INDEX "_DirectChatUsers_AB_unique" ON "_DirectChatUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_DirectChatUsers_B_index" ON "_DirectChatUsers"("B");

-- AddForeignKey
ALTER TABLE "DirectChat" ADD CONSTRAINT "DirectChat_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupChat" ADD CONSTRAINT "GroupChat_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "GroupChat"("chat_room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_user_login_fkey" FOREIGN KEY ("user_login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chat_room_id_fkey" FOREIGN KEY ("chat_room_id") REFERENCES "ChatRoom"("room_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_sender_login_fkey" FOREIGN KEY ("sender_login") REFERENCES "User"("login") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DirectChatUsers" ADD CONSTRAINT "_DirectChatUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "DirectChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DirectChatUsers" ADD CONSTRAINT "_DirectChatUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
