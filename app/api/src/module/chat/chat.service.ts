import { create } from 'domain'
import { object } from '@hapi/joi'
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createRoom(value: ChatRoomDto, user_login: string) {
        try {
            const chat = await this.prisma.chat.create({
                data: {
                    room_id: value.room_id,
                    name: value?.name,
                    image: value?.image,
                    type: value?.type,
                    password: value?.password,
                    chat_user: {
                        createMany: {
                            data: {
                                user_login: user_login,
                                role: 'OWNER',
                            },
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getRoom(room_id: string) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    room_id: room_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async addUserToRoom(room_id: string, user: ChatUserDto) {
        try {
            const chat = await this.prisma.chat.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    chat_user: {
                        create: {
                            user_login: user.user_login,
                            role: 'MEMBER',
                            status: user.status,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }
}