import { Injectable } from '@nestjs/common'
import { GroupChat, chatType, PrismaClient } from '@prisma/client'

@Injectable()
export class GroupChatSeeder {
    private prisma = new PrismaClient()
    private chats: GroupChat[]

    async seedGroupChats(): Promise<GroupChat[]> {
        this.chats = [
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room1' },
                update: {},
                create: {
                    chat_room_id: 'room1',
                    name: 'Mayers',
                    type: chatType.PUBLIC,
                    image: 'https://play-lh.googleusercontent.com/tAz_oa7rcTByVJZIFa4X0eC3zP5uRIxov_tzChPIAGcRQfEfDJglRvwV2wImWgjZKEI=w240-h480-rw',
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room2' },
                update: {},
                create: {
                    chat_room_id: 'room2',
                    name: 'Novembers',
                    type: chatType.PRIVATE,
                    image: 'https://play-lh.googleusercontent.com/tAz_oa7rcTByVJZIFa4X0eC3zP5uRIxov_tzChPIAGcRQfEfDJglRvwV2wImWgjZKEI=w240-h480-rw',
                },
            }),
            await this.prisma.groupChat.upsert({
                where: { chat_room_id: 'room3' },
                update: {},
                create: {
                    chat_room_id: 'room3',
                    name: 'bnaji - oal-tena',
                    type: chatType.PUBLIC,
                    image: 'https://play-lh.googleusercontent.com/tAz_oa7rcTByVJZIFa4X0eC3zP5uRIxov_tzChPIAGcRQfEfDJglRvwV2wImWgjZKEI=w240-h480-rw',
                },
            }),
        ]
        return this.chats
    }
}
