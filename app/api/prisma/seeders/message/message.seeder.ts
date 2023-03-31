import { Injectable } from '@nestjs/common'
import { Message, PrismaClient } from '@prisma/client'
import { create } from 'domain'

@Injectable()
export class MessageSeeder {
    private prisma = new PrismaClient()
    private messages: Message[]

    async seedMessages(): Promise<Message[]> {
        this.messages = [
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am bnaji',
                    sender_login: "bnaji",
                    chat_room_id: "room1",
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: "It's been 2 years in 42, Aren't we done yet?",
                    sender_login: 'bnaji',
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am aaljaber',
                    sender_login: 'aaljaber',
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am mal-guna',
                    sender_login: 'mal-guna',
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am oal-tena',
                    sender_login: 'oal-tena',
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am isaad',
                    sender_login: 'isaad',
                    chat_room_id: 'room2',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Why am I here?',
                    sender_login: 'isaad',
                    chat_room_id: 'room2',
                },
            }),
        ]
        return this.messages
    }

    async assignMessagesToChats(): Promise<void> {
        await this.prisma.chatRoom.update({
            where: { room_id: 'room1' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am bnaji',
                                sender_login: 'bnaji',
                            },
                            {
                                content: "It's been 2 years in 42, Aren't we done yet?",
                                sender_login: 'bnaji',
                            },
                            {
                                content: 'Hello I am aaljaber',
                                sender_login: 'aaljaber',
                            },
                            {
                                content: 'Hello I am mal-guna',
                                sender_login: 'mal-guna',
                            },
                            {
                                content: 'Hello I am oal-tena',
                                sender_login: 'oal-tena',
                            },
                        ],
                    },
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'room2' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am isaad',
                                sender_login: 'isaad',
                            },
                            {
                                content: 'Why am I here?',
                                sender_login: 'isaad',
                            },
                        ],
                    },
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'room3' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am bassam',
                                sender_login: "bnaji",
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: 'oal-tena',
                            },
                        ],
                    },
                },
            },
        })

        // Direct Chat
        await this.prisma.chatRoom.update({
            where: { room_id: 'direct_room1' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am bassam',
                                sender_login: "bnaji",
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: "oal-tena",
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'direct_room2' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am abrar',
                                sender_login: "aaljaber",
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: "bnaji",
                            },
                        ]
                    }
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: 'direct_room3' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am isaad',
                                sender_login: "isaad",
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: "mal-guna",
                            },
                        ]
                    }
                },
            },
        })
    }
}
