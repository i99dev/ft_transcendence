import { object } from '@hapi/joi';
import { ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from '@providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    // async createRoom(value: ChatRoomDto) {
    //     await this.prisma.chatRoom.upsert({
    //         where: {
    //             id: value.id
    //         },
    //         update: {},
    //         create: {
    //             name: value.name,
    //             image: value.image,
    //             type: value.type,
    //             password: value.password,
    //         },
    //     })
    // }
}
