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
                            role: user.role,
                            status: user.status, // 'INVITED' or 'NORMAL' or 'MUTED' or 'BANNED'
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async removeUserFromRoom(room_id: string, user_id: number) {
        try {
            const chat = await this.prisma.chat.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    chat_user: {
                        delete: {
                            id: user_id,
                        }
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async updateChatUser(user_id: number, room_id: string, user: ChatUserDto) {
        try {
            const chat = await this.prisma.chat.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    chat_user: {
                        update: {
                            where: {
                                id: user_id,
                            },
                            data: {
                                role: user.role,
                                status: user.status,
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

    async getChatUsers(room_id: string, user_id: number) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    room_id: room_id,
                },
                include: {
                    chat_user: {
                        where: {
                            id: user_id,
                        }
                    }
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async createMessage(user_login: string, room_id: string, message: string) {
        try {
            const chat = await this.prisma.chat.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    messages: {
                        create: {
                            content: message,
                            sender_login: user_login,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async deleteMessage(user_id: number, room_id: string, message_id: number){
        try {
            const chat = await this.prisma.chat.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    messages: {
                        delete: {
                            id: message_id,
                        },
                    },
                },
            })
            return chat;
        }
        catch (error) {
            console.log(error)
        }
    }
}
