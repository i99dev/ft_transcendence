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
                    sender_id: 1,
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: "It's been 2 years in 42, Aren't we done yet?",
                    sender_id: 1,
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am aaljaber',
                    sender_id: 5,
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am mal-guna',
                    sender_id: 3,
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am oal-tena',
                    sender_id: 2,
                    chat_room_id: 'room1',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Hello I am isaad',
                    sender_id: 4,
                    chat_room_id: 'room2',
                },
            }),
            await this.prisma.message.create({
                data: {
                    content: 'Why am I here?',
                    sender_id: 4,
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
                                sender_id: 1,
                            },
                            {
                                content: "It's been 2 years in 42, Aren't we done yet?",
                                sender_id: 1,
                            },
                            {
                                content: 'Hello I am aaljaber',
                                sender_id: 5,
                            },
                            {
                                content: 'Hello I am mal-guna',
                                sender_id: 3,
                            },
                            {
                                content: 'Hello I am oal-tena',
                                sender_id: 2,
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
                                sender_id: 4,
                            },
                            {
                                content: 'Why am I here?',
                                sender_id: 4,
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
                                sender_id: 1,
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_id: 2,
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
                                sender_id: 1,
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_id: 2,
                            },
                        ],
                    },
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
                                sender_id: 5,
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_id: 1,
                            },
                        ],
                    },
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
                                sender_id: 4,
                            },
                            {
                                content: 'Is this the direct chat?',
                                sender_id: 3,
                            },
                        ],
                    },
                },
            },
        })
    }
}
