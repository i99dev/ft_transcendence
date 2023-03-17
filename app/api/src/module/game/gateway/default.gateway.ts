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
import { DefaultService } from './default.service'

@WebSocketGateway({
    namespace: '/games',
    cors: { origin: 'http://localhost/play', credentials: true },
    path: '/api/socket.io',
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private logger = new Logger('DefaultGateway')

    constructor(private defaultService: DefaultService, private jwtService: JwtService) {}

    handleConnection(client: Socket, ...args: any[]) {
        // let token = client.request.headers.authorization
        // this.logger.log(token)
        // token = token.split(" ")[1]
        // const decoded = this.jwtService.decode(token)
        // this.logger.log(decoded)

        this.logger.log(`Client connected: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('move')
    movePlayer(client: any, @MessageBody() payload: any) {
        this.wss.emit('move', payload)
    }

    @SubscribeMessage('gameStatus')
    changeGameStatus(client: any, @MessageBody() payload: any) {
        this.wss.emit('gameStatus', payload)
    }
}
