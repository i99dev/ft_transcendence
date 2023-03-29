import { Logger } from '@nestjs/common'
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
        // const user = await this.chatWsService.extractUserFromJwt(client.request.headers.authorization)
        // if (!user)
        //     return this.socketError(client, 'Invalid token')
        // this.logger.log(user)

        // Joining all the rooms of the user
        this.joinAllRooms(client, user)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client "${client.id}" disconnected from chat`)
    }

    @SubscribeMessage('message')
    async sendMessage(client: any,@MessageBody() payload: any) {
        const { room_id, message } = await this.chatWsService.getMessageInfo(payload)
        this.wss.to(room_id).emit('message', message)
    }

    async joinAllRooms(client: Socket, user: string) {
        const chats = await this.chatWsService.findAllChats(user)
        for(let i = 0; i < chats.length; i++)
            client.join(chats[i].room_id)
    }

    socketError(client: Socket, error: string) {
        this.logger.error(error)
        client.emit('Invalid token')
        return client.disconnect()
    }
}
