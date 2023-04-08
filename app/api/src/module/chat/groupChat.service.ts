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
import { UpdateChatDto } from './gateway/dto/chatWs.dto'

@Injectable()
export class GroupService {
    constructor(private prisma: PrismaService) {}
    private chatRooms: ChatRoom[]

    async createGroupChatRoom(value: ChatRoomDto, user_id: number) {
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
                                        user_id: user_id,
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

    async getGroupChatRoom(room_id: string) {
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

    async addUserToGroupChat(room_id: string, user: ChatUserDto) {
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
                                    user_id: user.user_id,
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

    async getChatUserInRoom(room_id: string, user_id) {
        try {
            const userChat = await this.prisma.chatUser.findFirst({
                where: {
                    chat_room_id: room_id,
                    user_id: user_id,
                },
            })
            return userChat
        } catch (error) {
            console.log(error)
        }
    }

    async getChatRoomMessages(room_id: string, page: number) {
        try {
            const chat = await this.prisma.chatRoom.findUnique({
                where: {
                    room_id: room_id,
                },
                select: {
                    messages: {
                        skip: (page - 1) * 20,
                        take: 20,
                    },
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

    async getChatRooms() {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany()
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }

    async getChatRoomsForGroups() {
        try {
            const chatRooms = await this.prisma.chatRoom.findMany({
                where: {
                    type: 'GROUP',
                },
            })
            return chatRooms
        } catch (error) {
            console.log(error)
        }
    }

    async updateGroupChat(info: UpdateChatDto) {
        try {
            await this.prisma.groupChat.update({
                where: {
                    chat_room_id: info.room_id,
                },
                data: {
                    image: info?.image,
                    type: info?.type,
                    password: info?.password,
                    name: info?.name,
                },
            })
        } catch (error) {
            console.log(error)
        }
    }
}
