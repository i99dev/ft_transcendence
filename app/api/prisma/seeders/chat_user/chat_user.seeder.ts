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
                        user_id: 1,
                        chat_room_id: 'room1',
                    },
                },
                update: {},
                create: {
                    user_id: 1,
                    chat_room_id: 'room1',
                    role: ChatUserRole.OWNER,
                },
            }),
        ]
        return this.chatUsers
    }

    async assignUsersToChats(): Promise<void> {
        // Room 1
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 1, chat_room_id: 'room1' } },
                        update: {},
                        create: {
                            user_id: 1,
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 5, chat_room_id: 'room1' } },
                        update: {},
                        create: {
                            user_id: 5,
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 2, chat_room_id: 'room1' } },
                        update: {},
                        create: {
                            user_id: 2,
                            role: ChatUserRole.MEMBER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room1' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 3, chat_room_id: 'room1' } },
                        update: {},
                        create: {
                            user_id: 3,
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })

        // Room 2
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room2' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 4, chat_room_id: 'room2' } },
                        update: {},
                        create: {
                            user_id: 4,
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room3' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 1, chat_room_id: 'room3' } },
                        update: {},
                        create: {
                            user_id: 1,
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })

        // Room 3
        await this.prisma.groupChat.update({
            where: { chat_room_id: 'room3' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_id: 2, chat_room_id: 'room3' } },
                        update: {},
                        create: {
                            user_id: 2,
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
    }
}
