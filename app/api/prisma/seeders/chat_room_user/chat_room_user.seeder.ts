import { Injectable } from '@nestjs/common'
import { ChatRoomUserRole, ChatRoomUser, PrismaClient } from '@prisma/client'

@Injectable()
export class ChatRoomUserSeeder {
    private prisma = new PrismaClient()
    private chatRoomUsers: ChatRoomUser[]

    async seedChatRoomUsers(): Promise<ChatRoomUser[]> {
        this.chatRoomUsers = [
            await this.prisma.chatRoomUser.upsert({
                where: {
                    chat_room_user: {
                        user_login: 'bnaji',
                        chat_room_id: 'room1',
                    }
                },
                update: {},
                create: {
                    user_login: 'bnaji',
                    chat_room_id: 'room1',
                    role: ChatRoomUserRole.OWNER,
                },
            }),
        ]
        return this.chatRoomUsers
    }

    async assignUsersToChatRooms(): Promise<void> {
        await this.prisma.chatRoom.update({
            where: { room_id: 'room1' },
            data: {
                chat_room_user: {
                    createMany: {
                        data: [
                            {
                                user_login: 'bnaji',
                                role: ChatRoomUserRole.OWNER,
                            },
                            {
                                user_login: 'aaljaber',
                                role: ChatRoomUserRole.ADMIN,
                            },
                            {
                                user_login: 'mal-guna',
                                role: ChatRoomUserRole.MEMBER,
                            },
                            {
                                user_login: 'oal-tena',
                                role: ChatRoomUserRole.ADMIN,
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'room2' },
            data: {
                chat_room_user: {
                    createMany: {
                        data: [
                            {
                                user_login: 'isaad',
                                role: ChatRoomUserRole.OWNER,
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'room3' },
            data: {
                chat_room_user: {
                    createMany: {
                        data: [
                            {
                                user_login: 'bnaji',
                            },
                            {
                                user_login: 'oal-tena',
                            },
                        ]
                    }
                },
            },
        })
    }
}
