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
                        chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                    },
                },
                update: {},
                create: {
                    user_login: 'bnaji',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                    role: ChatUserRole.OWNER,
                },
            }),
        ]
        return this.chatUsers
    }

    async assignUsersToChats(): Promise<void> {
        // Room 1
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'bnaji', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' } },
                        update: {},
                        create: {
                            user_login: 'bnaji',
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'isaad', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' } },
                        update: {},
                        create: {
                            user_login: 'isaad',
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'oal-tena', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' } },
                        update: {},
                        create: {
                            user_login: 'oal-tena',
                            role: ChatUserRole.MEMBER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'mal-guna', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' } },
                        update: {},
                        create: {
                            user_login: 'mal-guna',
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })

        // Room 2
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'isaad', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618' } },
                        update: {},
                        create: {
                            user_login: 'isaad',
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'bnaji', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' } },
                        update: {},
                        create: {
                            user_login: 'bnaji',
                            role: ChatUserRole.ADMIN,
                        },
                    },
                },
            },
        })

        // Room 3
        await this.prisma.groupChat.update({
            where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' },
            data: {
                chat_user: {
                    upsert: {
                        where: { chat_user: { user_login: 'oal-tena', chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' } },
                        update: {},
                        create: {
                            user_login: 'oal-tena',
                            role: ChatUserRole.OWNER,
                        },
                    },
                },
            },
        })
    }
}
