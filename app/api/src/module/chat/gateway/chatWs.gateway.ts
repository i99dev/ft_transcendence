import { Logger, Req, UseGuards, UsePipes } from '@nestjs/common'
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
import {
    MessageType,
    ChatUserStatus,
    ChatUserRole,
    ChatUser,
    NotificationType,
} from '@prisma/client'
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
    RoomIdDto,
} from './dto/chatWs.dto'
import { WsException } from '@nestjs/websockets'
import { SocketValidationPipe } from '../../../common/pipes/socketObjValidation.pipe'
import { ChatService } from '../chat.service'
import { UserService } from '../../user/user.service'
import { GroupChatService } from '../groupChat.service'
import { NotificationService } from '../../notification/notification.service'
import { BlockService } from '@module/block/block.service'
import { ConfigService } from '@nestjs/config'
import { WsGuard } from '../../../common/guards/ws.guard'

@WebSocketGateway({
    namespace: '/chat',
    cors: { origin: '*' },
    path: '/api/socket.io',
})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private clients: Map<string, string> = new Map()
    private sockets: Map<string, Socket> = new Map()
    private query_id: any

    constructor(
        private chatWsService: ChatWsService,
        private chatService: ChatService,
        private groupChatService: GroupChatService,
        private userService: UserService,
        private jwtService: JwtService,
        private notificationService: NotificationService,
        private blockService: BlockService,
        private configService: ConfigService,
    ) {}

    private logger = new Logger('ChatWsGateway')

    async handleConnection(client: Socket, ...args: any[]) {
        const user_login = this.getID(client) as string
        if (!user_login) return
        this.clients.set(user_login, client.id)
        this.sockets.set(client.id, client)
        this.joinAllRooms(client, user_login)
        this.logger.log(`Client "${client.id}" connected to chat`)
    }

    async handleDisconnect(client: Socket) {
        // remove the client from the maps
        const user_login: string = this.getID(client) as string
        this.clients.delete(user_login)
        this.sockets.delete(client.id)
        
        this.logger.log(`Client "${client.id}" disconnected from chat`)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('create-group-chat')
    async createGroupChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateGroupChatDto,
    ) {
        if (!this.getID(client)) return
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')
        const chatRoom = await this.chatWsService.setupGroupChat(
            payload,
            client.handshake.auth.login,
            `${this.configService.get<string>('server.protocol',)}://${this.configService.get<string>('server.host')}`,
        )
        if (!chatRoom) return this.socketError('Failure in group chat creation!!')
        client.join(chatRoom.room_id)

        client.emit('create-group-chat', { room_id: chatRoom.room_id })
        await this.setupSpecialMessage(
            this.getID(client),
            chatRoom.room_id,
            `${client.handshake.auth.login} created a group chat`,
        )
        client.emit('new-group-list', {
            content: await this.groupChatService.getGroupChatForUser(client.handshake.auth.login),
            type: MessageType.SPECIAL,
        })
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('create-direct-chat')
    async createDirectChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateDirectChatDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')

        if (!(await this.userService.getUser(payload.user)))
            return this.socketError('Reciever not found')

        if (
            !(await this.blockService.checkIfAvailableFromBlock(
                client.handshake.auth.login,
                payload.user,
            ))
        )
            return this.socketError(`This user is unreachable`), []

        const room_id = await this.chatWsService.createDirectChat(
            client.handshake.auth.login,
            payload.user,
        )
        const target_id = (await this.userService.getUser(payload.user)).login
        const clientSocket = this.getSocket(target_id)
        clientSocket.join(room_id)
        client.join(room_id)

        await this.setupSpecialMessage(
            this.getID(client),
            room_id,
            `${client.handshake.auth.login} created a direct chat`,
        )
        this.wss.emit('new-direct-list', {
            content: await this.chatService.getDirectChatForUser(target_id),
            type: MessageType.SPECIAL,
        })
        client.emit('new-direct-list', {
            content: await this.chatService.getDirectChatForUser(client.handshake.auth.login),
            type: MessageType.SPECIAL,
        })
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('join-group-chat')
    async joinChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')

        if (!(await this.chatService.chatExist(payload.room_id)))
            return this.socketError('Invalid reciever')

        if (!(await this.chatWsService.validateGroupChat(payload.room_id)))
            return this.socketError('Not a group chat')

        if (await this.chatWsService.isUserBanned(payload.room_id, client.handshake.auth.login))
            return this.socketError('User is banned')

        if (
            await this.chatWsService.validateInvitation(
                payload.room_id,
                client.handshake.auth.login,
            )
        )
            return await this.setupSpecialMessage(
                this.getID(client),
                payload.room_id,
                `${client.handshake.auth.login} joined`,
            )

        if (await this.chatWsService.validatePassword(payload.room_id, payload.password))
            await this.chatWsService.joinGroupChat(payload.room_id, client.handshake.auth.login)
        else return this.socketError('Invalid password')
        client.join(payload.room_id)

        await this.setupSpecialMessage(
            this.getID(client),
            payload.room_id,
            `${client.handshake.auth.login} joined`,
        )
        client.emit('new-group-list', {
            content: await this.groupChatService.getGroupChatForUser(client.handshake.auth.login),
            type: MessageType.SPECIAL,
        })
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('exit-group-chat')
    async exitChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: RoomIdDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            await this.chatWsService.isUserOutsideChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            )
        )
            return this.socketError('User is already outside the chat room')

        const chatUsers = await this.chatWsService.leaveGroupChat(
            payload.room_id,
            client.handshake.auth.login,
        )

        this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)
        await this.setupSpecialMessage(
            this.getID(client),
            payload.room_id,
            `${client.handshake.auth.login} left`,
        )

        client.leave(payload.room_id)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('update')
    async UpdateChatInfo(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: UpdateChatDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever')
        await this.chatWsService.updateGroupChatRoom(payload, client.handshake.auth.login)

        await this.setupSpecialMessage(
            this.getID(client),
            payload.room_id,
            `${client.handshake.auth.login} updated a group chat`,
        )
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('admin-group-chat')
    async handleAdmin(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ): Promise<ChatUser[]> {
        if (
            !(await this.chatService.getUser(client.handshake.auth.login)) ||
            !(await this.chatService.getUser(payload.user_login))
        )
            return this.socketError('User not found'), []
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever'), []
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('User is neither admin nor owner'), []

        const groupChat = await this.chatWsService.handleAdminSetup(
            payload,
            client.handshake.auth.login,
        ) // 'upgrade' , 'downgrade', 'owner'
        this.wss.to(payload.room_id).emit('group-chat-users', groupChat.chat_user)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('user-group-chat')
    async handleAdminAction(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ): Promise<ChatUser[]> {
        if (
            !(await this.chatService.getUser(client.handshake.auth.login)) ||
            !(await this.chatService.getUser(payload.user_login))
        )
            return this.socketError('User not found'), []
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever'), []
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('User is neither admin nor owner'), []
        if (payload.user_login === (client.handshake.auth.login))
            return this.socketError('User cannot change himself'), []
        if (
            'OWNER' ===
            (await this.chatService.getChatUser(payload.room_id, payload.user_login))?.role
        )
            return this.socketError('User cannot change owner'), []

        if (payload.action === 'add') {
            const chatUsers = await this.chatWsService.addUser(payload.room_id, payload.user_login)
            const clientSocket = this.getSocket(payload.user_login)
            if (clientSocket) clientSocket.join(payload.room_id)
            await this.groupChatService.getGroupChatForUser(client.handshake.auth.login)

            this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)

            await this.setupSpecialMessage(
                this.getID(client),
                payload.room_id,
                `${client.handshake.auth.login} added ${payload.user_login}`,
            )

            if (clientSocket) {
                clientSocket.emit('new-group-list', {
                    content: await this.groupChatService.getGroupChatForUser(
                        this.getID(clientSocket) as string,
                    ),
                    type: MessageType.SPECIAL,
                })
            }
        } else if (payload.action === 'kick') {
            const chatUsers = await this.chatWsService.kickUser(
                payload.room_id,
                payload.user_login,
                client.handshake.auth.login,
            )
            const clientSocket = this.getSocket(payload.user_login)

            this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)

            await this.setupSpecialMessage(
                this.getID(client),
                payload.room_id,
                `${client.handshake.auth.login} kicked ${payload.user_login}`,
            )
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'invite') {
            await this.chatWsService.inviteUser(
                payload.room_id,
                payload.user_login,
                client.handshake.auth.login,
            )
            const clientSocket = this.getSocket(payload.user_login)
            if (clientSocket) {
                clientSocket.join(payload.room_id)
                const room = await this.groupChatService.getGroupChatRoom(payload.room_id)
                clientSocket.emit('add-message', {
                    content: `you got invited to ${room.name}`,
                    type: MessageType.SPECIAL,
                })
                this.notificationService.setUpNotificationMessage(
                    clientSocket,
                    await this.notificationService.createNotification({
                        user_login: payload.user_login,
                        type: NotificationType.CHAT_INVITE,
                        target: payload.room_id,
                        content: `you got invited to ${room.name} by ${this.getID(client)}`,
                    }),
                )
            }
        } else if (payload.action === 'mute') {
            const chatUsers = await this.chatWsService.muteUser(
                payload.room_id,
                payload.user_login,
                client.handshake.auth.login,
            )

            this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)
        } else if (payload.action === 'ban') {
            const chatUsers = await this.chatWsService.banUser(
                payload.room_id,
                payload.user_login,
                client.handshake.auth.login,
            )

            this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)

            const clientSocket = this.getSocket(payload.user_login)
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'reset') {
            const chatUsers = await this.chatWsService.resetUser(
                payload.room_id,
                payload.user_login,
                client.handshake.auth.login,
            )

            this.wss.to(payload.room_id).emit('group-chat-users', chatUsers.chat_user)
        } else return this.socketError('Invalid action'), []
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('add-message')
    async sendMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: AddMessageDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')
        let type_check
        if (
            !(type_check = await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever')

        if (type_check.type === 'GROUP') {
            if (
                !(await this.chatWsService.isUserNormal(
                    payload.room_id,
                    client.handshake.auth.login,
                ))
            )
                return this.socketError('User is not normal in the chat room')
            if (
                !(await this.chatWsService.checkUserInRoom1(
                    payload.room_id,
                    client.handshake.auth.login,
                ))
            )
                return this.socketError('User is not in channel')
        } else {
            if (
                !(await this.chatWsService.checkUserInRoom2(
                    payload.room_id,
                    client.handshake.auth.login,
                ))
            )
                return this.socketError('This user can not interfer in this DM')
            const user = await this.chatService.getDirectChatOtherUser(
                payload.room_id,
                client.handshake.auth.login,
            )
            if (
                !(await this.blockService.checkIfAvailableFromBlock(
                    client.handshake.auth.login,
                    user,
                ))
            )
                return this.socketError(`This user is unreachable`), []
        }

        if (!payload.message || payload.message === '') return this.socketError('Empty Message')

        const message = await this.chatService.createMessage(
            client.handshake.auth.login,
            payload.room_id,
            payload.message,
        )
        this.wss.to(payload.room_id).emit('add-message', message)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('delete-message')
    async deleteMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: DeleteMessageDto,
    ) {
        if (!(await this.chatService.getUser(client.handshake.auth.login)))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                client.handshake.auth.login,
            ))
        )
            return this.socketError('Invalid reciever')

        if (!(await this.chatWsService.isUserNormal(payload.room_id, client.handshake.auth.login)))
            return this.socketError('User is not normal in the chat room')

        this.chatService.deleteMessage(
            client.handshake.auth.login,
            payload.room_id,
            payload.message_id,
        )

        this.wss.to(payload.room_id).emit('delete-message', payload.message_id)
    }

    async joinAllRooms(client: Socket, user: string) {
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

    getID(client: Socket) {
        const user = this.chatWsService.extractUserFromJwt(client.handshake.headers.authorization)
        if (!user) {
            if (client.connected) client.disconnect()
            return null
        }
        return user
    }
}
