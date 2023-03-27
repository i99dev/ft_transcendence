/*
  Warnings:

  - A unique constraint covering the columns `[chat_room_id,user_login]` on the table `ChatRoomUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChatRoomUser_chat_room_id_user_login_key" ON "ChatRoomUser"("chat_room_id", "user_login");
