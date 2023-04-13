import { UserService } from './../../user/user.service'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import * as bcrypt from 'bcrypt'
import {
    ChatRoom,
    chatType,
    GroupChat,
    ChatRoomType,
    ChatUserRole,
    ChatUserStatus,
    ChatUser,
} from '@prisma/client'
import { decode } from 'punycode'
import { PrismaService } from '../../../providers/prisma/prisma.service'
import { ChatService } from '../chat.service'
import { SetUserDto, UpdateChatDto } from './dto/chatWs.dto'
import { GroupChatService } from '../groupChat.service'

@Injectable()
export class ChatWsService {
    constructor(
        private prisma: PrismaService,
        private chatService: ChatService,
        private groupChatService: GroupChatService,
        private jwtService: JwtService,
        private userService: UserService,
    ) {}
    private chatRooms: ChatRoom[]

    extractUserFromJwt(jwt: string) {
        if (!jwt) return null
        jwt = jwt.split(' ')[1]
        const decode = this.jwtService.decode(jwt)
        return !decode ? null : decode['login']
    }

    async setupGroupChat(payload: any, user_login: string) : Promise<ChatRoom> {
        if (
            payload.type === chatType.PROTECTED &&
            (payload.password === undefined || payload.password === null || payload.password === '')
        )
            throw new WsException('No password provided')

        const salt = bcrypt.genSaltSync(10)

        const room_id = crypto.randomUUID()
        console.log(payload.password)
        const chatRoom = await this.groupChatService.createGroupChatRoom(
            {
                room_id: room_id,
                name: payload.name,
                image: payload.image,
                type: payload.type,
                password: payload.password ? bcrypt.hashSync(payload.password, salt) : null,
            },
            user_login,
        )

        return chatRoom
    }

    async getPassword(room_id: string) {
        const room = await this.groupChatService.getChatRoom(room_id)
        let group
        if (room.type === ChatRoomType.GROUP) {
            group = await this.groupChatService.getGroupChatRoom(room_id)
            if (group.type === chatType.PROTECTED) return group.password
            else return null
        } else return null
    }

    async validatePassword(room_id: string, password: string): Promise<boolean> {
        const pass = await this.getPassword(room_id)
        if (pass === null) return true
        else return bcrypt.compareSync(password, pass)
    }

    async isUserOutsideChatRoom(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status === ChatUserStatus.OUT) return true
        return false
    }

    async isUserBanned(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status === ChatUserStatus.BAN) return true
        return false
    }

    async isUserNormal(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status === ChatUserStatus.NORMAL || !chatUser) return true
        return false
    }

    async canChangeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (
            (chatUser && chatUser.role === ChatUserRole.ADMIN) ||
            chatUser.role === ChatUserRole.OWNER
        )
            return true
        return false
    }

    async handleAdminSetup(payload: SetUserDto, user_login: string) {
        if (payload.action === 'upgrade')
            await this.makeAdmin(payload.room_id, payload.user_login)
        else if (payload.action === 'downgrade')
            await this.removeAdmin(payload.room_id, payload.user_login)
        else if (payload.action === 'owner')
            await this.makeOwner(payload.room_id, payload.user_login, user_login)
        else throw new WsException('Invalid action')

        return await this.groupChatService.getGroupChatUsers(payload.room_id)
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
        const chatOwner = await this.chatService.getChatUser(room_id, owner)
        if (chatOwner.role !== ChatUserRole.OWNER) throw new WsException('User is not the owner')

        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role !== ChatUserRole.ADMIN) throw new WsException('User is not an admin')

        await this.chatService.updateChatUser(owner, room_id, { role: ChatUserRole.ADMIN })
        await this.chatService.updateChatUser(user_login, room_id, { role: ChatUserRole.OWNER })
    }

    async joinGroupChat(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status !== ChatUserStatus.OUT)
            throw new WsException('User is already in chat room')
        else if (chatUser && chatUser.status === ChatUserStatus.BAN)
            throw new WsException('User is banned from chat room')

        await this.groupChatService.addUserToGroupChat(room_id, {
            user_login: user_login,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.NORMAL,
        })
        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async inviteUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        const room = await this.groupChatService.getGroupChatRoom(room_id)
        if (room.type !== chatType.PRIVATE) throw new WsException('Room is not protected')

        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (
            chatUser &&
            chatUser.status !== ChatUserStatus.OUT &&
            chatUser.status !== ChatUserStatus.BAN
        )
            throw new WsException('User is already in chat room, kicked or banned')

        await this.groupChatService.addUserToGroupChat(room_id, {
            user_login: user_login,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.INVITED,
        })
    }

    async leaveGroupChat(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser.role === ChatUserRole.OWNER)
            throw new WsException('Owner cannot leave chat room')
        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.OUT,
        })
        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async addUser(room_id: string, user_login: string) {
        return this.joinGroupChat(room_id, user_login)
    }

    async kickUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserOutsideChatRoom(room_id, user_login))
            throw new WsException('User is already outside the chat room')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.OUT,
        })

        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async banUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserOutsideChatRoom(room_id, user_login))
            throw new WsException('User is already outside the chat room')

        if (await this.isUserBanned(room_id, user_login))
            throw new WsException('User is already banned')

        this.chatService.updateUserStatus(user_login, room_id, 'BAN')

        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async muteUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (!(await this.isUserNormal(room_id, user_login)))
            throw new WsException('User is already outside the chat room')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.MUTE,
        })

        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async resetUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserNormal(room_id, user_login))
            throw new WsException('User is already normal')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.NORMAL,
        })

        return await this.groupChatService.getGroupChatUsers(room_id)
    }

    async validateUserInRoom(room_id: string, user_login: string) {
        const room = await this.groupChatService.getGroupChatRoom(room_id)
        if (room.type !== chatType.PRIVATE) return false

        const chatUser = await this.chatService.getChatUser(room_id, user_login)

        if (chatUser && chatUser.status === 'INVITED') return true
        else throw new WsException('User is not invited to this room')
    }

    async validateInvitation(room_id: string, user_login: string) {
        if (await this.validateUserInRoom(room_id, user_login)) {
            this.chatService.updateUserStatus(user_login, room_id, 'NORMAL')
            return true
        } else return false
    }

    async updateGroupChatRoom(room: UpdateChatDto, user_login: string) {
        if (!this.canChangeAdmin(room.room_id, user_login))
            throw new WsException('Request failed, not a admin')
        const oldRoom = await this.groupChatService.getGroupChatRoom(room.room_id)
        if (
            oldRoom.type !== chatType.PROTECTED &&
            room.type === chatType.PROTECTED &&
            (room.password === '' || room.password === undefined || room.password === null)
        )
            throw new WsException('Password cannot be empty')
        await this.groupChatService.updateGroupChat(room)
    }

    async validateGroupChat(room_id: string) {
        const room = await this.groupChatService.getChatRoom(room_id)
        if (room.type === ChatRoomType.GROUP) return true
        else return false
    }

    async createDirectChat(user_login: string, sender: string) {
        const user_id2 = (await this.userService.getUser(sender)).id
        if (user_login === sender) throw new WsException('Cannot create DM with yourself')
        const room_check = await this.chatService.checkCommonDirectChat(user_login, sender)
        if (room_check.length > 0) throw new WsException('Already created DM with this user')
        const room_id = crypto.randomUUID()
        await this.chatService.createDMChat(room_id, user_login, sender)
        return room_id
    }

    async checkUserInRoom1(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser) return true
        else return false
    }

    async checkUserInRoom2(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getDirectChatUser(room_id, user_login)
        if (chatUser) return true
        else return false
    }
}
