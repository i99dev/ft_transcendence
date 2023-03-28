import { Injectable } from '@nestjs/common'
import { Chat, PrismaClient } from '@prisma/client'

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
                },
            }),
            await this.prisma.chat.upsert({
              where: { room_id: 'room2' },
              update: {},
              create: {
                    room_id: 'room2',
                    name: 'Novembers',
                },
            }),
            await this.prisma.chat.upsert({
              where: { room_id: 'room3' },
              update: {},
              create: {
                    room_id: 'room3',
                    name: 'private bnaji&oal-tena',
                },
            }),
        ]
        return this.chats
    }
}
