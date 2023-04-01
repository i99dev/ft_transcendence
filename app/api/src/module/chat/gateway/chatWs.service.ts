import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { ChatRoom, chatType, GroupChat } from '@prisma/client'
import { decode } from 'punycode'
import { PrismaService } from '../../../providers/prisma/prisma.service'
import { ChatService } from '../chat.service'

@Injectable()
export class ChatWsService {
    constructor(
        private prisma: PrismaService,
        private chatService: ChatService,
        private jwtService: JwtService,
    ) {}
    private chatRooms: ChatRoom[]

    extractUserFromJwt(jwt: string) {
        jwt = jwt.split(' ')[1]
        const decode = this.jwtService.decode(jwt)
        return !decode ? null : decode['login']
    }

    async setupGroupChat(payload: any) {
        if (payload.type === chatType.PROTECTED && payload.password === undefined)
            throw new WsException('No password provided')

        const room_id = crypto.randomUUID()
        await this.chatService.createGroupChat(
            {
                room_id: room_id,
                name: payload.name,
                image: payload.image,
                type: payload.type,
                password: payload.password,
            },
            payload.sender,
        )

        return room_id
    }
}
