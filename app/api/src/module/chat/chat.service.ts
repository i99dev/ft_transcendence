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

    async createGroupChat(value: ChatRoomDto, user_login: string) {
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

    async createDMChat(value: ChatRoomDto, user_login: string, user_login2: string) {
        try {
            const chatRoom: ChatRoom = await this.prisma.chatRoom.create({
                data: {
                    room_id: value.room_id,
                    type: 'DM',
                    direct_chat: {
                        create: {
                            users: {
                                connect: [
                                    {
                                        login: user_login,
                                    },
                                    {
                                        login: user_login2,
                                    },
                                ],
                            }
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

    async getGroupRoom(room_id: string) {
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

    async getChatUser(room_id: string, user_login: string) {
        try {
            const chatUser = await this.prisma.chatUser.findUnique({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_login,
                    }
                }
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

    async updateUserStatus(user_id: string, room_id: string, status: ChatUserStatus) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_id,
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

    async updateUserRole(user_id: string, room_id: string, role: ChatUserRole) {
        try {
            const chat = await this.prisma.chatUser.update({
                where: {
                    chat_user: {
                        chat_room_id: room_id,
                        user_login: user_id,
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
        return (this.chatRooms = await this.prisma.chatRoom.findMany({
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
        }))
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
                type: chatType.DIRECT,
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

    async getChatUserInRoom(room_id: string, user_login: string) {
        try {
            const userChat = await this.prisma.chatUser.findFirst({
                where: {
                    chat_room_id: room_id,
                    user_login: user_login,
                },
            })
            return userChat;
        } catch (error) {
            console.log(error)
        }
    }

    async getChatUserMessagesInChatRoom(room_id: string, user_login: string) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
                include: {
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

    async getChatRoomMessages(room_id: string) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
                select: {
                    messages: true,
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getGroupChatUsers(room_id: string) {
        try {
            const chat = await this.prisma.groupChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                select: {
                    chat_user: true,
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


}
