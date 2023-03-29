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
import { AddUserDto, MainInfoDto, MessageDto, SetUserDto, UpdateChatDto } from './dto/chatWs.dto'
import { WsException } from '@nestjs/websockets'
import { SocketValidationPipe } from '../../../common/pipes/socketObjValidation.pipe'

@WebSocketGateway({
    namespace: '/chat',
    cors: { origin: 'ws://localhost/chat', credentials: true },
    path: '/api/socket.io',
})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    constructor(private chatWsService: ChatWsService, private jwtService: JwtService) {}

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

    @SubscribeMessage('Join')
    async joinChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: MainInfoDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('Join', `${payload.sender} joined`)
    }

    @SubscribeMessage('Exit')
    async exitChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: MainInfoDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('Exit', `${payload.sender} left`)
    }

    @SubscribeMessage('Add-User')
    async addChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: AddUserDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('Add-User', `${payload.sender} added '${payload.user}'`)
    }

    @SubscribeMessage('Kick-User')
    async kickChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: AddUserDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('Add-User', `${payload.sender} kicked '${payload.user}'`)
    }

    @SubscribeMessage('Update')
    async UpdateChatInfo(client: any,@MessageBody(new SocketValidationPipe()) payload: UpdateChatDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        if (payload.name)
            this.wss.to(payload.reciever).emit('Update', `${payload.sender} updated the chat name to ${payload.name}`)
        if (payload.image)
            this.wss.to(payload.reciever).emit('Update', `${payload.sender} updated the chat profile`)
    }

    @SubscribeMessage('Set-User')
    async setChatUser(client: any,@MessageBody(new SocketValidationPipe()) payload: SetUserDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) return this.socketError('Invalid reciever')

        this.wss.to(payload.reciever).emit('Set-User', `${payload.sender} has ${payload.action} '${payload.user}'`)
    }

    @SubscribeMessage('Message')
    async sendMessage(client: Socket,@MessageBody(new SocketValidationPipe()) payload: MessageDto) {
        if (!(await this.chatWsService.chatExist(payload.reciever))) {
            const chat = await this.chatWsService.findDirectChat(payload.sender, payload.reciever)
            if (!chat)
                return this.socketError("Invalid reciever")
            this.wss.to(chat.room_id).emit('Message', payload.message)
        }
        else
            this.wss.to(payload.reciever).emit('Message', payload.message)
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
