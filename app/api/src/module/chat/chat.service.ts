import { object } from '@hapi/joi';
import { ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from '@providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createRoom(value: ChatRoomDto) {
        console.log(value)
        await this.prisma.chat.upsert({
          where: {
            room_id: value.room_id,
          },
          update: {
            room_id: value.room_id,
            name: value?.name,
            image: value?.image,
            type: value?.type,
            password: value?.password
          },
          create: {
            room_id: value.room_id,
            name: value?.name,
            image: value?.image,
            type: value?.type,
            password: value?.password
          },
        })
      }
      
}
