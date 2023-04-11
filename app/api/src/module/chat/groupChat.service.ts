import { ChatRepository } from './repository/chat.repository';
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { PrismaService } from '@providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ChatRoom } from '@prisma/client'
import { UpdateChatDto } from './gateway/dto/chatWs.dto'

@Injectable()
export class GroupService {
    constructor(private prisma: PrismaService, private chatRepository: ChatRepository) {}
    private chatRooms: ChatRoom[]

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

    async getChatUserInRoom(room_id: string, user_login: string) {
        try {
            const userChat = await this.prisma.chatUser.findFirst({
                where: {
                    chat_room_id: room_id,
                    user_login: user_login,
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

    async getGroupChatForUser(user_login: string) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                where: {
                  chat_user: {
                    some: {
                      user_login: user_login,
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
                            },
                        },
                    },
                },
            });
            const sortedChat = this.chatRepository.sort(chat)
            return sortedChat
        } catch (error) {
            console.log(error)
        }
    }

    async searchGroupChat(search: string) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                where: {
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getAllGroupChats(page: number) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                skip: (page - 1) * 20,
                take: 20,
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }
}
