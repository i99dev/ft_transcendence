import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../../providers/prisma/prisma.service'

@Injectable({})
export class ChatRepository {
    constructor() {}

    sort(chatRooms: any[]): any[] {
        chatRooms.sort((a, b) => {
            if (
                a.chat_room.messages[0] &&
                a.chat_room.messages[0].created_at &&
                b.chat_room.messages[0] &&
                b.chat_room.messages[0].created_at
            )
                if (a.chat_room.messages[0].created_at < b.chat_room.messages[0].created_at)
                    return 1
                else return -1
            else {
                if (a.chat_room.created_at < b.chat_room.created_at) {
                    return -1
                } else return 1
            }
        })

        return chatRooms
    }
}
