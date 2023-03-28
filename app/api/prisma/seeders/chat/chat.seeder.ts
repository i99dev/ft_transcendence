import { Injectable } from '@nestjs/common'
import { Chat, chatType, PrismaClient } from '@prisma/client'

@Injectable()
export class ChatSeeder {
    private prisma = new PrismaClient()
    private chats: Chat[]

    async seedChats(): Promise<Chat[]> {
        this.chats = [
            await this.prisma.chat.upsert({
                where: { room_id: 'room1' },
                update: {},
                create: {
                    room_id: 'room1',
                    name: 'Mayers',
                    type: chatType.PUBLIC,
                },
            }),
            await this.prisma.chat.upsert({
              where: { room_id: 'room2' },
              update: {},
              create: {
                    room_id: 'room2',
                    name: 'Novembers',
                    type: chatType.PRIVATE,
                },
            }),
            await this.prisma.chat.upsert({
              where: { room_id: 'room3' },
              update: {},
              create: {
                    room_id: 'room3',
                    name: 'bnaji - oal-tena',
                    type: chatType.DIRECT,
                },
            }),
        ]
        return this.chats
    }
}
