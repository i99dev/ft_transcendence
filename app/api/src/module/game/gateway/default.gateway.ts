import { Logger, UseGuards } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
} from '@nestjs/websockets'
import console from 'console'
import { Server, Socket } from 'socket.io'
import { DefaultService } from './default.service'

@WebSocketGateway({
    namespace: '/games',
    // cors: { origin: 'http://ft_transcendence_web/', credentials: true },
    cors: true,
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private logger = new Logger('DefaultGateway')

    constructor(private defaultService: DefaultService, private jwtService: JwtService) {}

    handleConnection(client: Socket, ...args: any[]): any {
        // const token = client.request.headers.authorization
        // this.logger.log(token)
        // this.logger.log(process.env.JWT_SECRET)
        // const decoded = this.jwtService.verify(token, {
        //     secret: process.env.JWT_SECRET,
        // })
        // this.logger.log(decoded)
        // const token
        // this.logger.log(client)
        this.logger.log(`Client connected: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('move')
    OnNewMessage(client: any, payload: any) {
        this.wss.emit('move', payload)
    }
}
