import { create } from 'domain'
import { object } from '@hapi/joi'
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ChatRoom, MessageType } from '@prisma/client'
import { UpdateChatUserInterface } from './interface/chat.interface'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}

    async createGroupChat(value: ChatRoomDto, user_login: string) {
        try {
            const chatRoom: ChatRoom = await this.prisma.chatRoom.create({
                data: {
                    room_id: value.room_id,
                    group_chat: {
                        create: {
                            name: value?.name,
                            image: value?.image,
                            type: value?.type,
                            password: value?.password,
                            chat_user: {
                                createMany: {
                                    data: {
                                        user_login: user_login,
                                        role: 'OWNER',
                                        status: 'NORMAL',
                                    },
                                },
                            },
                        },
                    },
                },
            })
            return chatRoom
        } catch (error) {
            console.log(error)
        }
    }

    async getRoom(room_id: string) {
        try {
            const chat = await this.prisma.groupChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async addUserToRoom(room_id: string, user: ChatUserDto) {
        try {
            const chat = await this.prisma.groupChat.update({
                where: {
                    chat_room_id: room_id,
                },
                data: {
                    chat_user: {
                        upsert: {
                            where: {
                                chat_user: {
                                    chat_room_id: room_id,
                                    user_login: user.user_login,
                                },
                            },
                            update: user,
                            create: user,
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
            const chat = await this.prisma.groupChat.update({
                where: {
                    chat_room_id: room_id,
                },
                data: {
                    chat_user: {
                        delete: {
                            id: user_id,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async updateChatUser(user_login: string, room_id: string, user: UpdateChatUserInterface) {
        try {
            const chatUser = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_login,
                    },
                },
                data: user,
            })

            return chatUser
        } catch (error) {
            console.log(error)
        }
    }

    async getChatUsers(room_id: string, user_id: number) {
        try {
            const chat = await this.prisma.groupChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                include: {
                    chat_user: {
                        where: {
                            id: user_id,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async createMessage(
        user_login: string,
        room_id: string,
        message: string,
        type: MessageType = MessageType.NORMAL,
    ) {
        try {
            const chat = await this.prisma.chatRoom.update({
                where: {
                    room_id: room_id,
                },
                data: {
                    messages: {
                        create: {
                            content: message,
                            sender_login: user_login,
                            type: type,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async deleteMessage(user_login: string, room_id: string, message_id: number) {
        try {
            const chat = await this.prisma.message.delete({
                where: {
                    id: message_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }
}
