import { Injectable } from '@nestjs/common'
import { ChatUserRole, ChatUser, PrismaClient } from '@prisma/client'

@Injectable()
export class ChatUserSeeder {
    private prisma = new PrismaClient()
    private chatUsers: ChatUser[]

    async seedChatUsers(): Promise<ChatUser[]> {
        this.chatUsers = [
            await this.prisma.chatUser.upsert({
                where: {
                    chat_user: {
                        user_login: 'bnaji',
                        chat_room_id: 'room1',
                    }
                },
                update: {},
                create: {
                    user_login: 'bnaji',
                    chat_room_id: 'room1',
                    role: ChatUserRole.OWNER,
                },
            }),
        ]
        return this.chatUsers
    }

    async assignUsersToChats(): Promise<void> {
        await this.prisma.chat.update({
            where: { room_id: 'room1' },
            data: {
                chat_user: {
                    createMany: {
                        data: [
                            {
                                user_login: 'bnaji',
                                role: ChatUserRole.OWNER,
                            },
                            {
                                user_login: 'aaljaber',
                                role: ChatUserRole.ADMIN,
                            },
                            {
                                user_login: 'mal-guna',
                                role: ChatUserRole.MEMBER,
                            },
                            {
                                user_login: 'oal-tena',
                                role: ChatUserRole.ADMIN,
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room2' },
            data: {
                chat_user: {
                    createMany: {
                        data: [
                            {
                                user_login: 'isaad',
                                role: ChatUserRole.OWNER,
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room3' },
            data: {
                chat_user: {
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
