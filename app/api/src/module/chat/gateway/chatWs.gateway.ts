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
import { Server, Socket } from 'socket.io'
import { ChatWsService } from './chatWs.service'

@WebSocketGateway({
    namespace: '/chat',
    cors: { origin: 'http://localhost/play', credentials: true },
    path: '/api/socket.io',
})
export class ChatWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private logger = new Logger('ChatWsGateway')

    constructor(private chatWsService: ChatWsService, private jwtService: JwtService) {}

    handleConnection(client: Socket, ...args: any[]) {
        // let token = client.request.headers.authorization
        // this.logger.log(token)
        // token = token.split(" ")[1]
        // const decoded = this.jwtService.decode(token)
        // this.logger.log(decoded)

        this.logger.log(`Client "${client.id}" connected to chat`)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client "${client.id}" disconnected from chat`)
    }

    @SubscribeMessage('message')
    movePlayer(client: any, @MessageBody() payload: any) {
        this.wss.emit('move', payload)
    }
}
