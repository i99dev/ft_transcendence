import { create } from 'domain';
import { object } from '@hapi/joi';
import { ChatRoomDto } from './dto/chat.dto';
import { PrismaService } from '@providers/prisma/prisma.service';
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createRoom(value: ChatRoomDto) {
        console.log(value)
        await this.prisma.chat.create({
          data: {
            room_id: value.room_id,
            name: value?.name,
            image: value?.image,
            type: value?.type,
            password: value?.password
          },
        })
    }

    async getRoom(room_id: string) {
        return await this.prisma.chat.findUnique({
            where: {
                room_id: room_id
            }
        })
    }

    async addUserToRoom(room_id: string, user) {
        return await this.prisma.chat.update({
            where: {
                room_id: room_id
            },
            data: {
                chat_user: {
                    create: {
                        user_login: user.login,
                        role: user.role,
                        status: user.status
                    }
                }
            }
        });
    }
}
