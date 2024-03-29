import { ChatRepository } from './repository/chat.repository'
import { ChatUserDto } from './dto/chat.dto'
import { PrismaService } from '../../providers/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ChatRoom, ChatUserStatus } from '@prisma/client'
import { UpdateChatDto } from './gateway/dto/chatWs.dto'
import { ChatService } from './chat.service'

@Injectable()
export class GroupChatService {
    constructor(private prisma: PrismaService, private chatRepository: ChatRepository) {}

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

    async countUsersInGroupChat(room_id: string) {
        try {
            const count = await this.prisma.chatUser.count({
                where: {
                    chat_room_id: room_id,
                    NOT: {
                        status: {
                            in: ['OUT', 'BAN', 'INVITED'],
                        },
                    },
                },
            })
            return count
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
            delete chat.password
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
                    chat_user: {
                        where: {
                            NOT: {
                                status: {
                                    in: ['OUT', 'BAN', 'INVITED'],
                                },
                            },
                        },
                        include: {
                            user: true,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }
    async getGroupChatBannedUsers(room_id: string, type: ChatUserStatus) {
        try {
            const chat = await this.prisma.groupChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                select: {
                    chat_user: {
                        where: {
                            status: {
                                in: [type],
                            },
                        },
                        include: {
                            user: true,
                        },
                    },
                },
            })
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getGroupChats(user_login: string, page: number) {
        try {
            const groupChats = await this.prisma.groupChat.findMany({
                where: {
                    chat_user: {
                        some: {
                            user_login: user_login,
                        },
                    },
                },
                orderBy: {
                    chat_room: {
                        created_at: 'desc',
                    },
                },
                skip: (page - 1) * 20,
                take: 20,
            })
            for (const group of groupChats) {
                delete group.password
            }
            return groupChats
        } catch (error) {
            console.log(error)
        }
    }

    async updateGroupChat(info: UpdateChatDto) {
        try {
            const group = await this.prisma.groupChat.update({
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
            delete group.password
            return group
        } catch (error) {
            console.log(error)
        }
    }

    async getGroupChatForUser(user_login: string, page: number = 1) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                where: {
                    chat_user: {
                        some: {
                            user_login: user_login,
                            OR: [
                                {
                                    status: ChatUserStatus.NORMAL,
                                },
                                {
                                    status: ChatUserStatus.MUTE,
                                },
                            ],
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
                orderBy: {
                    id: 'desc',
                },
                skip: (page - 1) * 20,
                take: 20,
            })
            const sortedChat = this.chatRepository.sort(chat)
            for (const group of sortedChat) {
                delete group.password
            }
            return sortedChat
        } catch (error) {
            console.log(error)
        }
    }

    async searchGroupChat(search: string, user_login: string, page: number) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                where: {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                    type: {
                        not: 'PRIVATE',
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
                skip: (page - 1) * 20,
                take: 20,
            })
            for (const group of chat) {
                delete group.password
            }
            return chat
        } catch (error) {
            console.log(error)
        }
    }

    async getAllGroupChats(page: number) {
        try {
            const chat = await this.prisma.groupChat.findMany({
                where: {
                    type: {
                        not: 'PRIVATE',
                    },
                },
                skip: (page - 1) * 20,
                take: 20,
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
            })
            for (const group of chat) {
                delete group.password
            }
            return chat
        } catch (error) {
            console.log(error)
        }
    }
}
