import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { ChatRepository } from './repository/chat.repository'

@Injectable()
export class DirectChatService {
    constructor(private prisma: PrismaService, private chatRepository: ChatRepository) {}

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
            if (chatUser)
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

    async getDirectChatOtherUser(room_id: string, user_login: string) {
        try {
            const chatUser = await this.prisma.directChat.findUnique({
                where: {
                    chat_room_id: room_id,
                },
                include: {
                    users: true,
                },
            })
            let check: string = ''
            chatUser.users.map(user => {
                if (user.login !== user_login) {
                    check = user.login
                    return user
                }
            })
            return check
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

    async getDirectChats(user: string) {
        try {
            const directChats = await this.prisma.directChat.findMany({
                where: {
                    users: {
                        some: {
                            login: user,
                        },
                    },
                },
                include: {
                    users: true,
                },
            })
            return directChats
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
                            },
                        },
                    },
                    users: {
                        where: {
                            NOT: {
                                login: user_login,
                            },
                        },
                    },
                },
            })
            const sortedChat = await this.chatRepository.sort(chatRooms)
            return sortedChat
        } catch (error) {
            console.log(error)
        }
    }

    async getDirectChatbetweenUsers(user_login1: string, user_login2) {
        try {
            const chatRooms = await this.prisma.directChat.findMany({
                where: {
                    users: {
                        every: {
                            login: {
                                in: [user_login1, user_login2],
                            },
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
                    users: {
                        where: {
                            NOT: {
                                login: user_login1,
                            },
                        },
                    },
                },
            })
            const sortedChat = await this.chatRepository.sort(chatRooms)
            return sortedChat
        } catch (error) {
            console.log(error)
        }
    }
}
