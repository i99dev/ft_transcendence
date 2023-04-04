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

        // Authentification with JWT
        const user_string: any = client.handshake.query.user_id // temporary for testing
        if (!user_string) {
            this.logger.error('Invalid token')
            return client.disconnect()
        }
        const user: any = parseInt(user_string)
        // const user = await this.chatWsService.extractUserFromJwt(client.handshake.headers.authorization)
        // if (!user) {
        // this.logger.error('Invalid token')
        // return client.disconnect()
        // }
        // this.logger.log(user)

        // store the client in the maps
        this.clients.set(user, client.id)
        this.sockets.set(client.id, client)

        // Joining all the rooms of the user
        this.joinAllRooms(client, user)
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
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            // keep it as string login
            return this.socketError('User not found')
        const room_id = await this.chatWsService.setupGroupChat(
            payload,
            parseInt(client.handshake.query.user_id.toString()),
        )

        client.join(room_id)

        await this.setupSpecialMessage(
            parseInt(client.handshake.query.user_id.toString()),
            room_id,
            `${client.handshake.query.user_id} created a group chat`,
        )
    }

    @SubscribeMessage('create-direct-chat')
    async createDirectChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateDirectChatDto,
    ) {
    }

    @SubscribeMessage('join-group-chat')
    async joinChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            // keep it as string login
            return this.socketError('User not found')

        if (!(await this.chatService.chatExist(payload.room_id)))
            return this.socketError('Invalid reciever')

        if (!(await this.chatWsService.validateGroupChat(payload.room_id)))
            return this.socketError('Not a group chat')

        if (
            await this.chatWsService.isUserBanned(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
        )
            return this.socketError('User is banned')

        if (
            await this.chatWsService.validateInvitation(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
        )
            return await this.setupSpecialMessage(
                parseInt(client.handshake.query.user_id.toString()),
                payload.room_id,
                `${client.handshake.query.user_id} joined`,
            )

        if (await this.chatWsService.validatePassword(payload.room_id, payload.password))
            await this.chatWsService.joinGroupChat(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
        else return this.socketError('Invalid password')
        client.join(payload.room_id)

        await this.setupSpecialMessage(
            parseInt(client.handshake.query.user_id.toString()),
            payload.room_id,
            `${client.handshake.query.user_id} joined`,
        )
    }

    @SubscribeMessage('exit-group-chat')
    async exitChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            await this.chatWsService.isUserOutsideChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
        )
            return this.socketError('User is already outside the chat room')

        await this.chatWsService.leaveGroupChat(
            payload.room_id,
            parseInt(client.handshake.query.user_id.toString()),
        )

        await this.setupSpecialMessage(
            parseInt(client.handshake.query.user_id.toString()),
            payload.room_id,
            `${client.handshake.query.user_id} left`,
        )

        client.leave(payload.room_id)
    }

    @SubscribeMessage('update')
    async UpdateChatInfo(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: UpdateChatDto,
    ) {
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            // keep it as string login
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')
        await this.chatWsService.updateGroupChatRoom(
            payload,
            parseInt(client.handshake.query.user_id.toString()),
        )

        await this.setupSpecialMessage(
            parseInt(client.handshake.query.user_id.toString()),
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
                parseInt(client.handshake.query.user_id.toString()),
            )) ||
            !(await this.chatService.getUser(payload.user_id))
        )
            // keep it as string login
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('User is neither admin nor owner')

        await this.chatWsService.handleAdminSetup(
            payload,
            parseInt(client.handshake.query.user_id.toString()),
        ) // 'upgrade' , 'downgrade', 'owner'
    }

    @SubscribeMessage('user-group-chat')
    async handleAdminAction(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ) {
        if (
            !(await this.chatService.getUser(
                parseInt(client.handshake.query.user_id.toString()),
            )) ||
            !(await this.chatService.getUser(payload.user_id))
        )
            // keep it as string login
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')
        if (
            !(await this.chatWsService.canChangeAdmin(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('User is neither admin nor owner')

        if (payload.action === 'add') {
            await this.chatWsService.addUser(payload.room_id, payload.user_id)
            const clientSocket = this.getSocket(payload.user_id)
            if (clientSocket) clientSocket.join(payload.room_id)
            await this.setupSpecialMessage(
                parseInt(client.handshake.query.user_id.toString()),
                payload.room_id,
                `${client.handshake.query.user_id} added ${payload.user_id}`,
            )
        } else if (payload.action === 'kick') {
            await this.chatWsService.kickUser(
                payload.room_id,
                payload.user_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
            const clientSocket = this.getSocket(payload.user_id)
            await this.setupSpecialMessage(
                parseInt(client.handshake.query.user_id.toString()),
                payload.room_id,
                `${client.handshake.query.user_id} kicked ${payload.user_id}`,
            )
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'invite') {
            await this.chatWsService.inviteUser(
                payload.room_id,
                payload.user_id,
                parseInt(client.handshake.query.user_id.toString()),
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
                parseInt(client.handshake.query.user_id.toString()),
            )
            await this.setupSpecialMessage(
                parseInt(client.handshake.query.user_id.toString()),
                payload.room_id,
                `${client.handshake.query.user_id} muted ${payload.user_id}`,
            )
        } else if (payload.action === 'ban') {
            await this.chatWsService.banUser(
                payload.room_id,
                payload.user_id,
                parseInt(client.handshake.query.user_id.toString()),
            )
            const clientSocket = this.getSocket(payload.user_id)
            await this.setupSpecialMessage(
                parseInt(client.handshake.query.user_id.toString()),
                payload.room_id,
                `${client.handshake.query.user_id} banned ${payload.user_id}`,
            )
            if (clientSocket) clientSocket.leave(payload.room_id)
        } else if (payload.action === 'reset') {
            await this.chatWsService.resetUser(
                payload.room_id,
                payload.user_id,
                parseInt(client.handshake.query.user_id.toString()),
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
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            // keep it as string login
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')

        if (
            !(await this.chatWsService.isUserNormal(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('User is not normal in the chat room')

        this.chatService.createMessage(
            parseInt(client.handshake.query.user_id.toString()),
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
        if (!(await this.chatService.getUser(parseInt(client.handshake.query.user_id.toString()))))
            // keep it as string login
            return this.socketError('User not found')
        if (
            !(await this.chatService.validateChatRoom(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('Invalid reciever')

        if (
            !(await this.chatWsService.isUserNormal(
                payload.room_id,
                parseInt(client.handshake.query.user_id.toString()),
            ))
        )
            return this.socketError('User is not normal in the chat room')

        this.chatService.deleteMessage(
            parseInt(client.handshake.query.user_id.toString()),
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
}
