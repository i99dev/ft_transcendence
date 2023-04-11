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
import { MESSAGES } from '@nestjs/core/constants'
import { take } from 'rxjs'
import { use } from 'passport'

@Injectable()
export class ChatService {
    constructor(private prisma: PrismaService) {}
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

    async removeUserFromRoom(room_id: string, user_login: string) {
        try {
            const id = (await this.getChatUser(room_id, user_login)).id

            const chat = await this.prisma.groupChat.update({
                where: {
                    chat_room_id: room_id,
                },
                data: {
                    chat_user: {
                        delete: {
                            id: id,
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

    async getDirectChatUser(room_id: string, user_login: string) {
        try {
            const chatUser = await this.prisma.directChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                include: {
                    users: true,
                },
            })
            let check = false
            chatUser.users.map(user => {
                if (user.login === user_login) {
                    check = true
                    return user
                }
            })
            return check
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
                    type: type
                },
                include: {
                    sender: true
                }
            })
            return chatRoomMessage
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

    async updateUserRole(user_login: string, room_id: string, role: ChatUserRole) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_login,
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

    async getChatUserMessages(user_login: string) {
        try {
            const chat = await this.prisma.message.findMany({
                where: {
                    sender_login: user_login,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getDirectChatRooms(user) {
        try {
            const directChats = await this.prisma.directChat.findMany({
                where: {
                    users: {
                        some: {
                            id: user.id
                        }
                    }
                },
                include: {
                    users: true
                }
            })
            return directChats
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

    async getDirectChatForUser(user_login: string) {
        try {
            const chatRooms = await this.prisma.directChat.findMany({
                where: {
                    users: {
                        some: {
                            login: user_login,
                        },
                    },
                },
                include: {
                    chat_room: {
                        select: {
                            messages: {
                                orderBy: {
                                    created_at: 'desc',
                                },
                                take: 1,
                            }
                        }
                    },
                    users: true
                }
            })
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }
}
