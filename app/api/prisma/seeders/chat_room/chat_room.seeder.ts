import { Injectable } from '@nestjs/common'
import { ChatRoom, PrismaClient } from '@prisma/client'

@Injectable()
export class ChatRoomSeeder {
    private prisma = new PrismaClient()
    private chatRooms: ChatRoom[]

    async seedChatRooms(): Promise<ChatRoom[]> {
        this.chatRooms = [
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'room1' },
                update: {},
                create: {
                    room_id: 'room1',
                    name: 'Mayers',
                },
            }),
            await this.prisma.chatRoom.upsert({
              where: { room_id: 'room2' },
              update: {},
              create: {
                    room_id: 'room2',
                    name: 'Novembers',
                },
            }),
            await this.prisma.chatRoom.upsert({
              where: { room_id: 'room3' },
              update: {},
              create: {
                    room_id: 'room3',
                    name: 'private bnaji&oal-tena',
                },
            }),
        ]
        return this.chatRooms
    }
}
