import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatRoom, chatType, GroupChat } from '@prisma/client';
import { decode } from 'punycode';
import { PrismaService } from '../../../providers/prisma/prisma.service';

@Injectable()
export class ChatWsService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    private chatRooms : ChatRoom[];
    
    extractUserFromJwt(jwt: string) {
        jwt = jwt.split(" ")[1]
        const decode = this.jwtService.decode(jwt)
        return !decode ? null : decode['login']
    }

    async findAllChats(login: string): Promise<any[]> {
        return this.chatRooms = await this.prisma.chatRoom.findMany({
            where: {
                OR: [
                    {
                        group_chat: {
                            chat_user: {
                                some: {
                                    user: {
                                        login: login
                                    }
                                }
                            }
                        }
                    },
                    {
                        direct_chat: {
                            users: {
                                some: {
                                    login: login
                                }
                            }
                        }
                    }
                ]
            }
        });
    }

    async findDirectChat(login1: string, login2: string): Promise<any> {
        return await this.prisma.groupChat.findFirst({
            where: {
                chat_user: {
                    every: {
                        user: {
                            login: {
                                in: [login1, login2]
                            }
                        }
                    }
                },
                type: chatType.DIRECT
            }
        })
    }

   async findAllChatUsers(roomId: string): Promise<any[]>  {
        return await this.prisma.chatUser.findMany({
            where: {
                chat_room_id: roomId
            }
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
                                        login: user_login
                                    }
                                }
                            }
                        }
                    },
                    {
                        direct_chat: {
                            users: {
                                some: {
                                    login: user_login
                                }
                            }
                        }
                    }
                ]
            }
        })
   }

   async chatExist(room_id: string) {
         return await this.prisma.chatRoom.findFirst({
              where: {
                    room_id: room_id
              }
         })
   }

}
