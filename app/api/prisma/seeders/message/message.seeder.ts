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
                    sender_login: 'bnaji',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: "It's been 2 years in 42, Aren't we done yet?",
                    sender_login: 'bnaji',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am aaljaber',
                    sender_login: 'aaljaber',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am mal-guna',
                    sender_login: 'mal-guna',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am oal-tena',
                    sender_login: 'oal-tena',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am isaad',
                    sender_login: 'isaad',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Why am I here?',
                    sender_login: 'isaad',
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618',
                },
            }),
        ]
        return this.messages
    }

    async assignMessagesToChats(): Promise<void> {
        await this.prisma.chatRoom.update({
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
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
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618' },
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
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am bassam',
                                sender_login: 'bnaji',
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
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7614' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am bassam',
                                sender_login: 'bnaji',
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
        await this.prisma.chatRoom.update({
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7615' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am obaid',
                                sender_login: 'oal-tena',
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: 'bnaji',
                            },
                        ],
                    },
                },
            },
        })
        await this.prisma.chatRoom.update({
            where: { room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7616' },
            data: {
                messages: {
                    createMany: {
                        data: [
                            {
                                content: 'Hello I am isaad',
                                sender_login: 'isaad',
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_login: 'mal-guna',
                            },
                        ],
                    },
                },
            },
        })
    }
}
