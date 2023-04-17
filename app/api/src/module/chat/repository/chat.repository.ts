import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable({})
export class ChatRepository {
    constructor(private prisma: PrismaService) {}

    async sort(chatRooms: any[]) {
        for (let i: number = 0; i + 1 < chatRooms.length; i++) {
            let tmp
            if (chatRooms[i].chat_room.messages[0] &&
                chatRooms[i].chat_room.messages[0].created_at &&
                chatRooms[i + 1].chat_room.messages[0] &&
                chatRooms[i + 1].chat_room.messages[0].created_at &&
                chatRooms[i].chat_room.messages[0].created_at <
                chatRooms[i + 1].chat_room.messages[0].created_at
            ) {
                tmp = chatRooms[i]
                chatRooms[i] = chatRooms[i + 1]
                chatRooms[i + 1] = tmp
            }
        }
        return chatRooms
    }
}
