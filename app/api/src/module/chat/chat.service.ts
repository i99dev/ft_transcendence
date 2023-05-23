import { Status } from './../../auth/interface/intra.interface'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ChatRoom, MessageType, ChatUserStatus, Prisma } from '@prisma/client'
import { UpdateChatUserInterface } from './interface/chat.interface'
import { ChatRepository } from './repository/chat.repository'
import { ChatRoomDto } from './dto/chat.dto'
import { number } from 'joi'
import { DirectChatService } from './directChat.service'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService, private chatRepository: ChatRepository, private directChatService: DirectChatService) {}
    private chatRooms: ChatRoom[]

    async getUser(login: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    login: login,
                },
            })
            return user
        } catch (error) {
            console.log(error)
        }
    }

    async createDMChat(value: string, user_login: string, user_login2: string) {
        try {
            const chatRoom: ChatRoom = await this.prisma.chatRoom.create({
                data: {
                    room_id: value,
                    type: 'DM',
                    direct_chat: {
                        create: {
                            users: {
                                connect: [{ login: user_login }, { login: user_login2 }],
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

    async getChatUser(room_id: string, user_login: string) {
        try {
            const chatUser = await this.prisma.chatUser.findUnique({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_login,
                    },
                },
            })
            return chatUser
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
            const chatRoomMessage = await this.prisma.message.create({
                data: {
                    chat_room_id: room_id,
                    content: message,
                    sender_login: user_login,
                    type: type,
                },
                include: {
                    sender: true,
                },
            })
            return chatRoomMessage
        } catch (error) {
            console.log(error)
        }
    }

    async deleteMessage(user_login: string, room_id: string, message_id: number) {
        try {
            const chat = await this.prisma.message.deleteMany({
                where: {
                    chat_room_id: room_id,
                    sender_login: user_login,
                    id: message_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async updateUserStatus(user_login: string, room_id: string, status: ChatUserStatus) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_login,
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

    async findAllChats(login: string): Promise<any[]> {
        try {
            this.chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    OR: [
                        {
                            group_chat: {
                                chat_user: {
                                    some: {
                                        user: {
                                            login: login,
                                        },
                                    },
                                },
                            },
                        },
                        {
                            direct_chat: {
                                users: {
                                    some: {
                                        login: login,
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

    async validateChatRoom(room_id: string, user_login: string) {
        return await this.prisma.chatRoom.findFirst({
            where: {
                room_id: room_id,
                OR: [
                    {
                        group_chat: {
                            chat_user: {
                                some: {
                                    user: {
                                        login: user_login,
                                    },
                                },
                            },
                        },
                    },
                    {
                        direct_chat: {
                            users: {
                                some: {
                                    login: user_login,
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

    async getChatUserMessagesInChatRoom(room_id: string, user_login: string) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
                select: {
                    messages: {
                        where: {
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

    async checkCommonDirectChat(user_login: string, user_login2: string) {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    type: 'DM',
                    direct_chat: {
                        users: {
                            every: {
                                OR: [{ login: user_login }, { login: user_login2 }],
                            },
                        },
                    },
                },
            })
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }

    async createGroupChatRoom(value: ChatRoomDto, user_login: string) {
        try {
            const chatRoom: ChatRoom = await this.prisma.chatRoom.create({
                data: {
                    room_id: value.room_id,
                    type: 'GROUP',
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

    async validateChatUser(room_id: string, user_login: string) {
        try {
            const room = await this.prisma.chatRoom.findFirst({ where: { room_id: room_id } })
            if (room.type === 'GROUP') {
                const chatUser = await this.prisma.chatUser.findFirst({
                    where: {
                        chat_room_id: room_id,
                        user_login: user_login,
                        NOT: {
                            status: {
                                in: ['OUT', 'BAN', 'INVITED'],
                            },
                        },
                    },
                })
                return chatUser
            }
            else {
                const chatUser = await this.directChatService.getDirectChatUser(room_id, user_login)
                if (chatUser) return true
                return false
            }
        } catch (error) {
            console.log(error)
        }
    }

    async getChatRoomMessages(room_id: string, page: number, sort: any = 'asc', login: string) {
        try {
            if (!(await this.validateChatUser(room_id, login)))
                throw new NotFoundException('You are not a member of this chat')
            const chat = await this.prisma.message.findMany({
                where: {
                    chat_room: {
                        room_id: room_id,
                    },
                },
                include: {
                    sender: true,
                },
                orderBy: {
                    created_at: sort,
                },
                skip: (page - 1) * 20,
                take: 20,
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getChatRoom(room_id: string) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getChatRooms(page: number) {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany({
                orderBy: {
                    created_at: 'desc',
                },
                skip: (page - 1) * 20,
                take: 20,
            })
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }
}
