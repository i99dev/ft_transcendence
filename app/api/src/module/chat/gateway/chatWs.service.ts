import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { ChatRoom, chatType, ChatUserRole, ChatUserStatus } from '@prisma/client'
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

    async isUserOutsideChatRoom(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.status === ChatUserStatus.OUT) return true
    }

    async canChangeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.ADMIN || chatUser.role === ChatUserRole.OWNER) return true
    }

    async handleAdminSetup(payload: SetUserDto) {
        if (payload.action === 'upgrade')
            await this.makeAdmin(payload.reciever, payload.user)
        else if (payload.action === 'downgrade')
            await this.removeAdmin(payload.reciever, payload.user)
        else if (payload.action === 'owner')
            await this.makeOwner(payload.reciever, payload.user, payload.sender)
        else 
            throw new WsException('Invalid action')
    }

    async makeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.ADMIN) throw new WsException('User is already admin')

        if (chatUser.role !== ChatUserRole.OWNER && chatUser.role === ChatUserRole.MEMBER) {
            await this.chatService.updateChatUser(user_login, room_id, {
                role: ChatUserRole.ADMIN,
            })
        }
    }
    
    async removeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.MEMBER) throw new WsException('User is not admin')

        if (chatUser.role !== ChatUserRole.OWNER && chatUser.role === ChatUserRole.ADMIN) {
            await this.chatService.updateChatUser(user_login, room_id, {
                role: ChatUserRole.MEMBER,
            })
        }
    }
    
    async makeOwner(room_id: string, user_login: string, owner: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role !== ChatUserRole.OWNER) throw new WsException('User is not the owner')

        await this.chatService.updateChatUser(owner, room_id, {role: ChatUserRole.ADMIN})
        await this.chatService.updateChatUser(user_login, room_id, {role: ChatUserRole.OWNER})
    }

    async joinGroupChat(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status !== ChatUserStatus.OUT)
            throw new WsException('User is already in chat room')

        await this.chatService.addUserToRoom(room_id, {
            user_login: user_login,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.NORMAL,
        })
    }

    async leaveGroupChat(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.OWNER) throw new WsException('Owner cannot leave chat room')
        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.OUT,
        })
    }

    async addUser(room_id: string, user_login: string) {
        console.log(room_id, user_login)
        this.joinGroupChat(room_id, user_login)
    }
    
    async kickUser(room_id: string, user_login: string) {
        if (await this.isUserOutsideChatRoom(room_id, user_login)) 
            throw new WsException('User is already outside the chat room')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.OUT,
        })
    }
    
    // async banUser(room_id: string, user_login: string) {

    // }
    
    // async muteUser(room_id: string, user_login: string) {

    // }
    
    // async resetUser(room_id: string, user_login: string) {

    // }
}
