import { Injectable } from '@nestjs/common'
import { ChatRoom, ChatRoomType, PrismaClient } from '@prisma/client'

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
                    type: ChatRoomType.GROUP
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'room2' },
                update: {},
                create: {
                    room_id: 'room2',
                    type: ChatRoomType.GROUP
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'room3' },
                update: {},
                create: {
                    room_id: 'room3',
                    type: ChatRoomType.GROUP
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room1' },
                update: {},
                create: {
                    room_id: 'direct_room1',
                    type: ChatRoomType.DM
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room2' },
                update: {},
                create: {
                    room_id: 'direct_room2',
                    type: ChatRoomType.DM
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: 'direct_room3' },
                update: {},
                create: {
                    room_id: 'direct_room3',
                    type: ChatRoomType.DM
                },
            }),
        ]
        return this.chatRooms
    }
}
