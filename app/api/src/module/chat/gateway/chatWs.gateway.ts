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
} from './dto/chatWs.dto'
import { WsException } from '@nestjs/websockets'
import { SocketValidationPipe } from '../../../common/pipes/socketObjValidation.pipe'
import { ChatService } from '../chat.service'

@WebSocketGateway({
    namespace: '/chat',
    cors: { origin: 'ws://localhost/chat', credentials: true },
    path: '/api/socket.io',
})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    constructor(
        private chatWsService: ChatWsService,
        private chatService: ChatService,
        private jwtService: JwtService,
    ) {}

    private logger = new Logger('ChatWsGateway')

    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client "${client.id}" connected to chat`)

        // Authentification with JWT
        const user: any = client.handshake.query.login // temporary for testing
        // const user = await this.chatWsService.extractUserFromJwt(client.handshake.headers.authorization)
        // if (!user) {
        // this.logger.error('Invalid token')
        // return client.disconnect()
        // }
        // this.logger.log(user)

        // Joining all the rooms of the user
        this.joinAllRooms(client, user)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client "${client.id}" disconnected from chat`)
    }

    @SubscribeMessage('create-group-chat')
    async createGroupChat(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: CreateGroupChatDto,
    ) {
        const room_id = await this.chatWsService.setupGroupChat(payload)

        client.join(room_id)

        await this.setupSpecialMessage(
            payload.sender,
            room_id,
            `${payload.sender} created a group chat`,
        )
    }

    @SubscribeMessage('join-group-chat')
    async joinChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.chatExist(payload.reciever)))
            return this.socketError('Invalid reciever')

        await this.chatService.addUserToRoom(payload.reciever, {
            user_login: payload.sender,
            role: ChatUserRole.MEMBER,
            status: ChatUserStatus.NORMAL,
        })
        client.join(payload.reciever)

        await this.setupSpecialMessage(payload.sender, payload.reciever, `${payload.sender} joined`)
    }

    @SubscribeMessage('exit-group-chat')
    async exitChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: MainInfoDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        await this.chatService.updateChatUser(payload.sender, payload.reciever, {
            status: ChatUserStatus.OUT,
        })
        await this.setupSpecialMessage(payload.sender, payload.reciever, `${payload.sender} left`)

        client.leave(payload.reciever)
    }

    @SubscribeMessage('add-user')
    async addChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: AddUserDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('add-user', `${payload.sender} added '${payload.user}'`)
    }

    @SubscribeMessage('kick-user')
    async kickChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: AddUserDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        this.wss
            .to(payload.reciever)
            .emit('kick-user', `${payload.sender} kicked '${payload.user}'`)
    }

    @SubscribeMessage('update')
    async UpdateChatInfo(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: UpdateChatDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        if (payload.name)
            this.wss
                .to(payload.reciever)
                .emit('update', `${payload.sender} updated the chat name to ${payload.name}`)
        if (payload.image)
            this.wss
                .to(payload.reciever)
                .emit('update', `${payload.sender} updated the chat profile`)
    }

    @SubscribeMessage('set-user')
    async setChatUser(
        @ConnectedSocket() client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: SetUserDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        this.wss
            .to(payload.reciever)
            .emit('set-user', `${payload.sender} has ${payload.action} '${payload.user}'`)
    }

    @SubscribeMessage('add-message')
    async sendMessage(
        client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: AddMessageDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        this.chatService.createMessage(payload.sender, payload.reciever, payload.message)

        this.wss
            .to(payload.reciever)
            .emit('add-message', { message: payload.message, type: MessageType.NORMAL })
    }

    @SubscribeMessage('delete-message')
    async deleteMessage(
        client: Socket,
        @MessageBody(new SocketValidationPipe()) payload: DeleteMessageDto,
    ) {
        if (!(await this.chatService.validateChatRoom(payload.reciever, payload.sender)))
            return this.socketError('Invalid reciever')

        this.chatService.deleteMessage(payload.sender, payload.reciever, payload.message_id)

        this.wss.to(payload.reciever).emit('delete-message', payload.message_id)
    }

    async joinAllRooms(client: Socket, user: string) {
        const chats = await this.chatService.findAllChats(user)
        for (let i = 0; i < chats.length; i++)
            if (chats[i].status !== ChatUserStatus.OUT) client.join(chats[i].room_id)
    }

    socketError(error: string) {
        this.logger.error(error)
        throw new WsException(error)
    }

    async setupSpecialMessage(sender: string, room_id: string, message: string) {
        await this.chatService.createMessage(sender, room_id, message, MessageType.SPECIAL)
        this.wss.to(room_id).emit('add-message', { content: message, type: MessageType.SPECIAL })
    }
}
