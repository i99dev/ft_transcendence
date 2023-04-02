import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { WsException } from '@nestjs/websockets'
import { ChatRoom, chatType, GroupChat, ChatRoomType, ChatUserRole, ChatUserStatus } from '@prisma/client'
import { decode } from 'punycode'
import { PrismaService } from '../../../providers/prisma/prisma.service'
import { ChatService } from '../chat.service'
import { SetUserDto } from './dto/chatWs.dto'
import { GroupService } from '../groupChat.service'


@Injectable()
export class ChatWsService {
    constructor(
        private prisma: PrismaService,
        private chatService: ChatService,
        private groupService: GroupService,
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
        await this.groupService.createGroupChatRoom(
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
        const room = await this.groupService.getChatRoom(room_id);
        let group;
        if (room.type === ChatRoomType.GROUP) {
            group = await this.groupService.getGroupChatRoom(room_id);
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
        if (chatUser && chatUser.status === ChatUserStatus.NORMAL) return true
        return false
    }

    async canChangeAdmin(room_id: string, user_login: string) {
        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.role === ChatUserRole.ADMIN || chatUser.role === ChatUserRole.OWNER) return true
        return false
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

        await this.groupService.addUserToGroupChat(room_id, {
            user_login: user_login,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.NORMAL,
        })
    }

    async inviteUser(room_id: string, user_login: string, sender: string) {
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        const room = await this.groupService.getGroupChatRoom(room_id)
        if (room.type !== chatType.PRIVATE)
            throw new WsException('Room is not protected')

        const chatUser = await this.chatService.getChatUser(room_id, user_login)
        if (chatUser && chatUser.status !== ChatUserStatus.OUT && chatUser.status !== ChatUserStatus.BAN)
            throw new WsException('User is already in chat room, kicked or banned')

        await this.groupService.addUserToGroupChat(room_id, {
            user_login: user_login,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.INVITED,
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
    
    async kickUser(room_id: string, user_login: string, sender: string) {
        
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserOutsideChatRoom(room_id, user_login)) 
            throw new WsException('User is already outside the chat room')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.OUT,
        })
    }
    
    async banUser(room_id: string, user_login: string, sender: string) {
        
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserOutsideChatRoom(room_id, user_login)) 
            throw new WsException('User is already outside the chat room')

        if (await this.isUserBanned(room_id, user_login))
            throw new WsException('User is already banned')

        this.chatService.updateUserStatus(user_login, room_id, 'BAN');
    }

    async muteUser(room_id: string, user_login: string, sender: string) {
        
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (!(await this.isUserNormal(room_id, user_login))) 
            throw new WsException('User is already outside the chat room')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.MUTE,
        })
    }

    async resetUser(room_id: string, user_login: string, sender: string) {
        
        if (!(await this.canChangeAdmin(room_id, sender)))
            throw new WsException('Request failed, not a admin')

        if (await this.isUserNormal(room_id, user_login)) 
            throw new WsException('User is already normal')

        await this.chatService.updateChatUser(user_login, room_id, {
            status: ChatUserStatus.NORMAL,
        })
    }

    async validateUserInRoom(room_id: string, user_login: string) {
        const room = await this.groupService.getGroupChatRoom(room_id)
        if (room.type !== chatType.PRIVATE)
            return false;

        const chatUser = await this.chatService.getChatUser(room_id, user_login);

        if (chatUser && chatUser.status === 'INVITED')
            return true;
        else
            throw new WsException('User is not invited to this room');
    }

    async validateInvitation(room_id: string, user_login: string) {
        if (await this.validateUserInRoom(room_id, user_login))
        {
            this.chatService.updateUserStatus(user_login, room_id, 'NORMAL');
            return true;
        }
        else return false;
    }
    
    // async banUser(room_id: string, user_login: string) {

    // }
    
    // async muteUser(room_id: string, user_login: string) {

    // }
    
    // async resetUser(room_id: string, user_login: string) {

    // }

}
