import { Logger } from '@nestjs/common'
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
    // cors: { origin: 'http://ft_transcendence_web/', credentials: true },
    cors: true,
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect { 
    @WebSocketServer()
    wss: Server

    private logger = new Logger('DefaultGateway')

    constructor(private defaultService: DefaultService) {}

    handleConnection(client: Socket, ...args: any[]): any {
        this.logger.log(`Client connected: ${client.id}`)
    }

    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('move')
    OnNewMessage(client: any, payload: any) {
        console.log('move')
        console.log(payload)
        this.wss.emit('move', payload)
    }
}
