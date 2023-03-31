import { Logger, UseGuards, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets'
import { chatType } from '@prisma/client'
import { Server, Socket } from 'socket.io'
import { ChatWsService } from './chatWs.service'
import { AddUserDto, MainInfoDto, AddMessageDto, SetUserDto, UpdateChatDto, DeleteMessageDto } from './dto/chatWs.dto'
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

    constructor(private chatWsService: ChatWsService, private chatService: ChatService, private jwtService: JwtService) {}

    private logger = new Logger('ChatWsGateway')


    async handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client "${client.id}" connected to chat`)

        // Authentification with JWT
        const user : any = client.handshake.query.login         // temporary for testing
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

    @SubscribeMessage('join')
    async joinChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: MainInfoDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('join', `${payload.sender} joined`)
    }

    @SubscribeMessage('exit')
    async exitChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: MainInfoDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('exit', `${payload.sender} left`)
    }

    @SubscribeMessage('add-user')
    async addChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: AddUserDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('add-user', `${payload.sender} added '${payload.user}'`)
    }

    @SubscribeMessage('kick-user')
    async kickChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: AddUserDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('kick-user', `${payload.sender} kicked '${payload.user}'`)
    }

    @SubscribeMessage('update')
    async UpdateChatInfo(client: any,@MessageBody(new SocketValidationPipe()) payload: UpdateChatDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError('Invalid reciever')

        if (payload.name)
            this.wss.to(payload.reciever).emit('update', `${payload.sender} updated the chat name to ${payload.name}`)
        if (payload.image)
            this.wss.to(payload.reciever).emit('update', `${payload.sender} updated the chat profile`)
    }

    @SubscribeMessage('set-user')
    async setChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: SetUserDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('set-user', `${payload.sender} has ${payload.action} '${payload.user}'`)
    }

    @SubscribeMessage('add-message')
    async sendMessage(client: Socket,@MessageBody(new SocketValidationPipe()) payload: AddMessageDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError("Invalid reciever")
        
        this.chatService.createMessage(payload.sender, payload.reciever, payload.message)

        this.wss.to(payload.reciever).emit('add-message', payload.message)
    }

    @SubscribeMessage('delete-message')
    async deleteMessage(client: Socket,@MessageBody(new SocketValidationPipe()) payload: DeleteMessageDto) {
        if (!(await this.chatWsService.validateChatRoom(payload.reciever, payload.sender))) return this.socketError("Invalid reciever")

        this.chatService.deleteMessage(payload.sender, payload.reciever, payload.message_id)

        this.wss.to(payload.reciever).emit('delete-message', payload.message_id)
    }

    async joinAllRooms(client: Socket, user: string) {
        const chats = await this.chatWsService.findAllChats(user)
        for(let i = 0; i < chats.length; i++)
            client.join(chats[i].room_id)
    }

    socketError(error: string) {
        this.logger.error(error)
        throw new WsException(error)
    }
}
