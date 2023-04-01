import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { ChatRoom, chatType, GroupChat, ChatRoomType, ChatUserRole, ChatUserStatus } from '@prisma/client'
import { decode } from 'punycode'
import { PrismaService } from '../../../providers/prisma/prisma.service'
import { ChatService } from '../chat.service'
import { SetUserDto } from './dto/chatWs.dto'


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

    async getPassword(room_id: string) {
        const room = await this.chatService.getRoom(room_id);
        let group;
        if (room.type === ChatRoomType.GROUP) {
            group = await this.chatService.getGroupRoom(room_id);
            if (group.type === chatType.PROTECTED)
                return group.password
            else
                return null
        }
        else
            return null
    }

    async validatePassword(room_id: string, password: string): Promise<boolean> {
        const pass = await this.getPassword(room_id);
        if (pass === null)
            return true
        else
            return pass === password
    }


    async isUserOutsideChatRoom(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.status === ChatUserStatus.OUT) return true
    }

    async isUserAllowed(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.ADMIN || chatUser.role === ChatUserRole.OWNER) return true
    }

    async handleAdminSetup(payload: SetUserDto) {
        if (payload.action === 'upgrade')
            await this.makeAdmin(payload.reciever, payload.user)
        else if (payload.action === 'downgrade')
            await this.removeAdmin(payload.reciever, payload.user)
    }

    async makeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role !== ChatUserRole.OWNER && chatUser.role === ChatUserRole.MEMBER) {
            await this.chatService.updateChatUser(room_id, user_login, {
                role: ChatUserRole.ADMIN,
            })
        }
    }
    
    async removeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role !== ChatUserRole.OWNER && chatUser.role === ChatUserRole.ADMIN) {
            await this.chatService.updateChatUser(room_id, user_login, {
                role: ChatUserRole.MEMBER,
            })
        }
    }


}
