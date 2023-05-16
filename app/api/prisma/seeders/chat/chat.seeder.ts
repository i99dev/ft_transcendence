import { Injectable } from '@nestjs/common'
import { GroupChat, chatType } from '@prisma/client'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable()
export class GroupChatSeeder {
    private prisma = new PrismaService()
    private chats: GroupChat[]

    async seedGroupChats(): Promise<GroupChat[]> {
        this.chats = [
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7617',
                    name: 'Mayers',
                    type: chatType.PUBLIC,
                    image: `${process.env.PROTOCOL}://${process.env.HOST}/api/multer/download/default_image/files/default.png`,
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7618',
                    name: 'Novembers',
                    type: chatType.PRIVATE,
                    image: `${process.env.PROTOCOL}://${process.env.HOST}/api/multer/download/default_image/files/default.png`,
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619' },
                update: {},
                create: {
                    chat_room_id: '5a48398f-30ae-489f-b22a-4fc20e0b7619',
                    name: 'Master Class',
                    type: chatType.PUBLIC,
                    image: `${process.env.PROTOCOL}://${process.env.HOST}/api/multer/download/default_image/files/default.png`,
                },
            }),
        ]
        return this.chats
    }
}
