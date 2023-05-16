import { Injectable } from '@nestjs/common'
import { ChatRoom, ChatRoomType, PrismaClient } from '@prisma/client'

@Injectable()
export class ChatRoomSeeder {
    private prisma = new PrismaClient()
    private chatRooms: ChatRoom[]

    async seedChatRooms(): Promise<ChatRoom[]> {
        this.chatRooms = [
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                    type: ChatRoomType.GROUP,
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618',
                    type: ChatRoomType.GROUP,
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619',
                    type: ChatRoomType.GROUP,
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7614' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7614',
                    type: ChatRoomType.DM,
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7615' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7615',
                    type: ChatRoomType.DM,
                },
            }),
            await this.prisma.chatRoom.upsert({
                where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7616' },
                update: {},
                create: {
                    room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7616',
                    type: ChatRoomType.DM,
                },
            }),
        ]
        return this.chatRooms
    }
}
