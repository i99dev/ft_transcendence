import { create } from 'domain'
import { object } from '@hapi/joi'
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ChatRoom, MessageType, ChatUserStatus, ChatUserRole } from '@prisma/client'
import { UpdateChatUserInterface } from './interface/chat.interface'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { chatType, GroupChat } from '@prisma/client'
import { decode } from 'punycode'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
    private chatRooms: ChatRoom[]

    async getUser(id) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: id,
                },
            })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async createDMChat(value: string, user_id: number, user_id2: number) {
        try {
            const chatRoom: ChatRoom = await this.prisma.chatRoom.create({
                data: {
                    room_id: value,
                    type: 'DM',
                    direct_chat: {
                        create: {
                            users: {
                                connect: [{ id: user_id }, { id: user_id2 }],
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

    async getDMRoom(room_id: string) {
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

    async updateChatUser(user_id: number, room_id: string, user: UpdateChatUserInterface) {
        try {
            const chatUser = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_id: user_id,
                    },
                },
                data: user,
            })

            return chatUser
        } catch (error) {
            console.log(error)
        }
    }

    async getChatUser(room_id: string, user_id: number) {
        try {
            const chatUser = await this.prisma.chatUser.findUnique({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_id: user_id,
                    },
                },
            })
            return chatUser
        } catch (error) {
            console.log(error)
        }
    }

    async createMessage(
        user_id,
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
                            sender_id: user_id,
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

    async deleteMessage(user_id, room_id: string, message_id: number) {
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

    async updateUserStatus(user_id: number, room_id: string, status: ChatUserStatus) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_id: user_id,
                    },
                },
                data: {
                    status: status,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async updateUserRole(user_id, room_id: string, role: ChatUserRole) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_id: user_id,
                    },
                },
                data: {
                    role: role,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async findAllChats(login): Promise<any[]> {
        try {
            this.chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    OR: [
                        {
                            group_chat: {
                                chat_user: {
                                    some: {
                                        user: {
                                            id: login,
                                        },
                                    },
                                },
                            },
                        },
                        {
                            direct_chat: {
                                users: {
                                    some: {
                                        id: login,
                                    },
                                },
                            },
                        },
                    ],
                },
            })
            return this.chatRooms
        } catch (error) {
            throw new Error(error)
        }
    }

    async findDirectChat(login1: string, login2: string): Promise<any> {
        return await this.prisma.groupChat.findFirst({
            where: {
                chat_user: {
                    every: {
                        user: {
                            login: {
                                in: [login1, login2],
                            },
                        },
                    },
                },
                type: chatType.PUBLIC,
            },
        })
    }

    async findAllChatUsers(roomId: string): Promise<any[]> {
        return await this.prisma.chatUser.findMany({
            where: {
                chat_room_id: roomId,
            },
        })
    }

    async isDirect(room_id: string) {
        //  return await this.prisma.chat.findFirst({
        //       where: {
        //             room_id: {
        //                 equals: room_id
        //             },
        //             type: {
        //                 equals: chatType.DIRECT
        //             },
        //       }
        //  })
    }

    async validateChatRoom(room_id: string, user_id) {
        return await this.prisma.chatRoom.findFirst({
            where: {
                room_id: room_id,
                OR: [
                    {
                        group_chat: {
                            chat_user: {
                                some: {
                                    user: {
                                        id: user_id,
                                    },
                                },
                            },
                        },
                    },
                    {
                        direct_chat: {
                            users: {
                                some: {
                                    id: user_id,
                                },
                            },
                        },
                    },
                ],
            },
        })
    }

    async chatExist(room_id: string) {
        return await this.prisma.chatRoom.findFirst({
            where: {
                room_id: room_id,
            },
        })
    }

    async getChatUserMessagesInChatRoom(room_id: string, user_id: number) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
                select: {
                    messages: {
                        where: {
                            sender_id: user_id,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getDirectChatUsers(room_id: string) {
        try {
            const chat = await this.prisma.directChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                select: {
                    users: true,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getChatUserMessages(user_id: number) {
        try {
            const chat = await this.prisma.message.findMany({
                where: {
                    sender_id: user_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getDirectChatRooms() {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    type: 'DM',
                },
            })
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }

    async checkCommonDirectChat(user_id: number, user_id2: number) {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    type: 'DM',
                    direct_chat: {
                        users: {
                            every: {
                                OR: [
                                    {id: user_id},
                                    {id: user_id2},
                                ],
                            },
                        },
                    },
                },
            })
            console.log(chatRooms)
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }
}
