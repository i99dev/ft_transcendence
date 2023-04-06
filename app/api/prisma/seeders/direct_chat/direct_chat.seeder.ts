import { Injectable } from '@nestjs/common'
import { DirectChat, PrismaClient } from '@prisma/client'

@Injectable()
export class DirectChatSeeder {
    private prisma = new PrismaClient()
    private directChats: DirectChat[]

    async seedDirectChats(): Promise<DirectChat[]> {
        this.directChats = [
            await this.prisma.directChat.upsert({
                where: { chat_room_id: 'direct_room1' },
                update: {},
                create: {
                    chat_room_id: 'direct_room1',
                    users: {
                        connect: [{ login: 'bnaji' }, { login: 'aaljaber' }],
                    },
                },
            }),
            await this.prisma.directChat.upsert({
                where: { chat_room_id: 'direct_room2' },
                update: {},
                create: {
                    chat_room_id: 'direct_room2',
                    users: {
                        connect: [{ login: 'bnaji' }, { login: 'oal-tena' }],
                    },
                },
            }),
            await this.prisma.directChat.upsert({
                where: { chat_room_id: 'direct_room3' },
                update: {},
                create: {
                    chat_room_id: 'direct_room3',
                    users: {
                        connect: [{ login: 'isaad' }, { login: 'mal-guna' }],
                    },
                },
            }),
        ]
        return this.directChats
    }
}
