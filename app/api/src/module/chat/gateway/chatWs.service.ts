import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatRoom, chatType, GroupChat } from '@prisma/client';
import { decode } from 'punycode';
import { PrismaService } from '../../../providers/prisma/prisma.service';

@Injectable()
export class ChatWsService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}
    private groupChats : GroupChat[];
    
    extractUserFromJwt(jwt: string) {
        jwt = jwt.split(" ")[1]
        const decode = this.jwtService.decode(jwt)
        return !decode ? null : decode['login']
    }

    async getMessageInfo(payload: any) {
        const load = JSON.parse(payload)
        let room_id = load.reciever
        if (load.type === chatType.DIRECT) {
            const chat = await this.findDirectChat(load.sender, load.reciever)
            room_id = chat.room_id
        }
        return { room_id: room_id, message: load.message }
    }

    async findAllChats(login: string): Promise<any[]> {
        return this.groupChats = await this.prisma.groupChat.findMany({
            where: {
                chat_user: {
                    some: {
                        user: {
                            login: login
                        }
                    }
                }
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
                type: 'DIRECT'
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

}
