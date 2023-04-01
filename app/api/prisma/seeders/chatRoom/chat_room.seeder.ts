import { Injectable } from '@nestjs/common'
import { ChatRoom, chatType, PrismaClient } from '@prisma/client'

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
                    type: 'DM'
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'room2' },
                update: {},
                create: {
                    room_id: 'room2',
                    type: 'DM'
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'room3' },
                update: {},
                create: {
                    room_id: 'room3',
                    type: 'DM'
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room1' },
                update: {},
                create: {
                    room_id: 'direct_room1',
                    type: 'DM'
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room2' },
                update: {},
                create: {
                    room_id: 'direct_room2',
                    type: 'DM'
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room3' },
                update: {},
                create: {
                    room_id: 'direct_room3',
                    type: 'DM'
                },
            }),
        ]
        return this.chatRooms
    }
}
