import { Injectable } from '@nestjs/common'
import { DirectChat, PrismaClient } from '@prisma/client'

@Injectable()
export class DirectChatSeeder {
    private prisma = new PrismaClient()
    private directChats: DirectChat[]

    async seedDirectChats(): Promise<DirectChat[]> {
        this.directChats = [
            await this.prisma.directChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7614' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7614',
                    users: {
                        connect: [{ login: 'bnaji' }, { login: 'aaljaber' }],
                    },
                },
            }),
            await this.prisma.directChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7615' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7615',
                    users: {
                        connect: [{ login: 'bnaji' }, { login: 'oal-tena' }],
                    },
                },
            }),
            await this.prisma.directChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7616' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7616',
                    users: {
                        connect: [{ login: 'isaad' }, { login: 'mal-guna' }],
                    },
                },
            }),
        ]
        return this.directChats
    }
}
