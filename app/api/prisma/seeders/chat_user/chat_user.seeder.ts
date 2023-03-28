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

        // Room 1
        await this.prisma.chat.update({
            where: { room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'bnaji', chat_room_id: 'room1' } },
                        update: {},
                        create: {
                                user_login: 'bnaji',
                                role: ChatUserRole.OWNER,
                            },
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'aaljaber', chat_room_id: 'room1' } },
                        update: {},
                        create: {
                                user_login: 'aaljaber',
                                role: ChatUserRole.ADMIN,
                            },
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'mal-guna', chat_room_id: 'room1' } },
                        update: {},
                        create: {
                                user_login: 'mal-guna',
                                role: ChatUserRole.MEMBER,
                            },
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'oal-tena', chat_room_id: 'room1' } },
                        update: {},
                        create: {
                                user_login: 'oal-tena',
                                role: ChatUserRole.ADMIN,
                            },
                    }
                },
            },
        })

        // Room 2
        await this.prisma.chat.update({
            where: { room_id: 'room2' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'isaad', chat_room_id: 'room2' } },
                        update: {},
                        create:
                            {
                                user_login: 'isaad',
                                role: ChatUserRole.OWNER,
                            },
                    }
                },
            },
        })
        await this.prisma.chat.update({
            where: { room_id: 'room3' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'bnaji', chat_room_id: 'room3' } },
                        update: {},
                        create:
                            {
                                user_login: 'bnaji',
                            },
                    }
                },
            },
        })

        // Room 3
        await this.prisma.chat.update({
            where: { room_id: 'room3' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'oal-tena', chat_room_id: 'room3' } },
                        update: {},
                        create:
                            {
                                user_login: 'oal-tena',
                            },
                    }
                },
            },
        })
    }
}
