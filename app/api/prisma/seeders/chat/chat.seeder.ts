import { Injectable } from '@nestjs/common'
import { GroupChat, chatType, PrismaClient } from '@prisma/client'

@Injectable()
export class GroupChatSeeder {
    private prisma = new PrismaClient()
    private chats: GroupChat[]

    async seedGroupChats(): Promise<GroupChat[]> {
        this.chats = [
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room1' },
                update: {},
                create: {
                    chat_room_id: 'room1',
                    name: 'Mayers',
                    type: chatType.PUBLIC,
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room2' },
                update: {},
                create: {
                    chat_room_id: 'room2',
                    name: 'Novembers',
                    type: chatType.PRIVATE,
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room3' },
                update: {},
                create: {
                    chat_room_id: 'room3',
                    name: 'bnaji - oal-tena',
                    type: chatType.DIRECT,
                },
            }),
        ]
        return this.chats
    }
}
