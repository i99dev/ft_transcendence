import { Logger, UseGuards, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
} from '@nestjs/websockets'
import { MessageType, ChatUserStatus, ChatUserRole } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { ChatWsService } from './chatWs.service'
import {
    AddUserDto,
    MainInfoDto,
    AddMessageDto,
    SetUserDto,
    UpdateChatDto,
    DeleteMessageDto,
    CreateGroupChatDto,
    CreateDirectChatDto,
} from './dto/chatWs.dto'
import { WsException } from '@nestjs/websockets'
import { SocketValidationPipe } from '../../../common/pipes/socketObjValidation.pipe'
import { ChatService } from '../chat.service'
import { UserService } from '../../user/user.service'
import { GroupService } from '../groupChat.service'

@WebSocketGateway({
    namespace: '/chat',
    cors: { origin: 'ws://localhost/chat', credentials: true },
    path: '/api/socket.io',
})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private clients: Map<number, string> = new Map()
    private sockets: Map<string, Socket> = new Map()
    private query_id: any

    constructor(
        private chatWsService: ChatWsService,
        private chatService: ChatService,
        private groupService: GroupService,
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    private logger = new Logger('ChatWsGateway')

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client "${client.id}" connected to chat`)
        this.clients.set(((await this.getID(client) as unknown) as number), client.id)
        this.sockets.set(client.id, client)
        this.joinAllRooms(client, await this.getID(client))
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client "${client.id}" disconnected from chat`)

        // remove the client from the maps
        const user_login: string = client.handshake.query.user_id.toString()
        const user = parseInt(user_login)
        this.clients.delete(user)
        this.sockets.delete(client.id)
    }

    @SubscribeMessage('create-group-chat')
    async createGroupChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateGroupChatDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')
        const room_id = await this.chatWsService.setupGroupChat(
            payload,
            await this.getID(client),
        )

        client.join(room_id)

        await this.setupSpecialMessage(
            await this.getID(client),
            room_id,
            `${client.handshake.query.user_id} created a group chat`,
        )
        client.emit('new-group-list', await this.groupService.getGroupChatForUser(await this.getID(client)))
    }

    @SubscribeMessage('create-direct-chat')
    async createDirectChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateDirectChatDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')

        if (!(await this.userService.getUser(payload.user)))
            return this.socketError('Reciever not found')

        const room_id = await this.chatWsService.createDirectChat(
            await this.getID(client),
            payload.user,
        )

        client.join(room_id)

        await this.setupSpecialMessage(
            await this.getID(client),
            room_id,
            `${client.handshake.query.user_id} created a direct chat`,
        )
        client.emit('new-direct-list', await this.chatService.getDirectChatForUser(await this.getID(client)))
    }

    @SubscribeMessage('join-group-chat')
    async joinChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')

        if (!(await this.chatService.chatExist(payload.room_id)))
            return this.socketError('Invalid reciever')

        if (!(await this.chatWsService.validateGroupChat(payload.room_id)))
            return this.socketError('Not a group chat')

        if (
            await this.chatWsService.isUserBanned(
                payload.room_id,
                await this.getID(client),
            )
        )
            return this.socketError('User is banned')

        if (
            await this.chatWsService.validateInvitation(
                payload.room_id,
                await this.getID(client),
            )
        )
            return await this.setupSpecialMessage(
                await this.getID(client),
                payload.room_id,
                `${client.handshake.query.user_id} joined`,
            )

        if (await this.chatWsService.validatePassword(payload.room_id, payload.password))
            await this.chatWsService.joinGroupChat(
                payload.room_id,
                await this.getID(client),
            )
        else return this.socketError('Invalid password')
        client.join(payload.room_id)

        await this.setupSpecialMessage(
            await this.getID(client),
            payload.room_id,
            `${client.handshake.query.user_id} joined`,
        )
        client.emit('new-group-list', await this.groupService.getGroupChatForUser(await this.getID(client)))
    }

    @SubscribeMessage('exit-group-chat')
    async exitChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            await this.chatWsService.isUserOutsideChatRoom(
                payload.room_id,
                await this.getID(client),
            )
        )
            return this.socketError('User is already outside the chat room')

        await this.chatWsService.leaveGroupChat(
            payload.room_id,
            await this.getID(client),
        )

        await this.setupSpecialMessage(
            await this.getID(client),
            payload.room_id,
            `${client.handshake.query.user_id} left`,
        )

        client.emit('new-group-list', await this.groupService.getGroupChatForUser(await this.getID(client)))
        client.leave(payload.room_id)
    }

    @SubscribeMessage('update')
    async UpdateChatInfo(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: UpdateChatDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')
        await this.chatWsService.updateGroupChatRoom(
            payload,
            await this.getID(client),
        )

        await this.setupSpecialMessage(
            await this.getID(client),
            payload.room_id,
            `${client.handshake.query.user_id} updated a group chat`,
        )
    }

    @SubscribeMessage('admin-group-chat')
    async handleAdmin(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ) {
        if (
            !(await this.chatService.getUser(
                await this.getID(client),
            )) ||
            !(await this.chatService.getUser(payload.user_id))
        )
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('User is neither admin nor owner')

        await this.chatWsService.handleAdminSetup(
            payload,
            await this.getID(client),
        ) // 'upgrade' , 'downgrade', 'owner'
    }

    @SubscribeMessage('user-group-chat')
    async handleAdminAction(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ) {
        if (
            !(await this.chatService.getUser(
                await this.getID(client),
            )) ||
            !(await this.chatService.getUser(payload.user_id))
        )
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('User is neither admin nor owner')

        if (payload.action === 'add') {
            await this.chatWsService.addUser(payload.room_id, payload.user_id)
            const clientSocket = this.getSocket(payload.user_id)
            if (clientSocket) clientSocket.join(payload.room_id)
            clientSocket.emit('new-group-list', await this.groupService.getGroupChatForUser(await this.getID(client)))
            await this.setupSpecialMessage(
                await this.getID(client),
                payload.room_id,
                `${client.handshake.query.user_id} added ${payload.user_id}`,
            )
        } else if (payload.action === 'kick') {
            await this.chatWsService.kickUser(
                payload.room_id,
                payload.user_id,
                await this.getID(client),
            )
            const clientSocket = this.getSocket(payload.user_id)
            await this.setupSpecialMessage(
                await this.getID(client),
                payload.room_id,
                `${client.handshake.query.user_id} kicked ${payload.user_id}`,
            )
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'invite') {
            await this.chatWsService.inviteUser(
                payload.room_id,
                payload.user_id,
                await this.getID(client),
            )
            const clientSocket = this.getSocket(payload.user_id)
            if (clientSocket) {
                clientSocket.join(payload.room_id)
                const room = await this.groupService.getGroupChatRoom(payload.room_id)
                clientSocket.emit('add-message', {
                    content: `you got invited to ${room.name}`,
                    type: MessageType.SPECIAL,
                })
            }
        } else if (payload.action === 'mute') {
            await this.chatWsService.muteUser(
                payload.room_id,
                payload.user_id,
                await this.getID(client),
            )
            await this.setupSpecialMessage(
                await this.getID(client),
                payload.room_id,
                `${client.handshake.query.user_id} muted ${payload.user_id}`,
            )
        } else if (payload.action === 'ban') {
            await this.chatWsService.banUser(
                payload.room_id,
                payload.user_id,
                await this.getID(client),
            )
            const clientSocket = this.getSocket(payload.user_id)
            await this.setupSpecialMessage(
                await this.getID(client),
                payload.room_id,
                `${client.handshake.query.user_id} banned ${payload.user_id}`,
            )
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'reset') {
            await this.chatWsService.resetUser(
                payload.room_id,
                payload.user_id,
                await this.getID(client),
            )
            const clientSocket = this.getSocket(payload.user_id)
            if (clientSocket) {
                const room = await this.groupService.getGroupChatRoom(payload.room_id)
                clientSocket.emit('add-message', {
                    content: `you got back to normal in ${room.name} chat`,
                    type: MessageType.SPECIAL,
                })
            }
        } else return this.socketError('Invalid action')
    }

    @SubscribeMessage('add-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: AddMessageDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')
        let type_check
        if (
            !(type_check = await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')

        if (type_check.type === 'GROUP') {
            if (
                !(await this.chatWsService.isUserNormal(
                    payload.room_id,
                    await this.getID(client),
                ))
            )
                return this.socketError('User is not normal in the chat room')
            if (
                !(await this.chatWsService.checkUserInRoom1(
                    payload.room_id,
                    await this.getID(client),
                ))
            )
                return this.socketError('User is not in channel')
        } else {
            if (
                !(await this.chatWsService.checkUserInRoom2(
                    payload.room_id,
                    await this.getID(client),
                ))
            )
                return this.socketError('This user can not interfer in this DM')
        }

        this.chatService.createMessage(
            await this.getID(client),
            payload.room_id,
            payload.message,
        )

        this.wss
            .to(payload.room_id)
            .emit('add-message', { message: payload.message, type: MessageType.NORMAL })
    }

    @SubscribeMessage('delete-message')
    async deleteMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: DeleteMessageDto,
    ) {
        if (!(await this.chatService.getUser(await this.getID(client))))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('Invalid reciever')

        if (
            !(await this.chatWsService.isUserNormal(
                payload.room_id,
                await this.getID(client),
            ))
        )
            return this.socketError('User is not normal in the chat room')

        this.chatService.deleteMessage(
            await this.getID(client),
            payload.room_id,
            payload.message_id,
        )

        this.wss.to(payload.room_id).emit('delete-message', payload.message_id)
    }

    async joinAllRooms(client: Socket, user) {
        try {
            const chats = await this.chatService.findAllChats(user)
            for (let i = 0; i < chats.length; i++)
                if (chats[i].status !== ChatUserStatus.OUT) client.join(chats[i].room_id)
        } catch (error) {
            this.logger.error(error)
        }
    }

    socketError(error: string) {
        this.logger.error(error)
        throw new WsException(error)
    }

    async setupSpecialMessage(sender, room_id: string, message: string) {
        await this.chatService.createMessage(sender, room_id, message, MessageType.SPECIAL)
        this.wss.to(room_id).emit('add-message', { content: message, type: MessageType.SPECIAL })
    }

    getSocket(user): Socket {
        const clientId = this.clients.get(user)
        if (clientId) return this.sockets.get(clientId)
    }

    async getID(client: Socket) {
        let user : number
        if (client.handshake.query.user_id)
            user = parseInt(client.handshake.query.user_id.toString())
        if (!user) {
            user = await this.chatWsService.extractUserFromJwt(client.handshake.headers.authorization)
            if (!user) {
                this.logger.error('Invalid token')
                return client.disconnect()
            }
        }
        return user
    }
}
