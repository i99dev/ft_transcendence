import { Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import {
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
    SubscribeMessage,
    WebSocketGateway,
    ConnectedSocket,
    WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { DefaultService } from './default.service'
import { GameSelectDto, PlayerDto } from '../dto/game.dto'
import { SocketService } from './socket.service'
@WebSocketGateway({
    namespace: '/games',
    cors: { origin: '*' },
    path: '/api/socket.io',
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger = new Logger('DefaultGateway')
    private decoded: any

    constructor(
        private gameService: DefaultService,
        private socketService: SocketService,
        private jwtService: JwtService,
    ) {}

    afterInit(server: Server) {
        this.socketService.setServer(server)
    }

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`)
        let token = client.request.headers.authorization
        if (!token) return new WsException('No token provided') && client.disconnect()
        token = token.split(' ')[1]
        this.decoded = this.jwtService.decode(token)
        if (!this.decoded) return
        this.gameService.addConnectedUser(this.decoded['login'], client)
    }

    @SubscribeMessage('Join-game')
    Join(@ConnectedSocket() client: any, @MessageBody() payload: GameSelectDto) {
        if (payload.gameMode == 'single')
            this.gameService.createSingleGame(client, payload.gameType)
        else if (payload.gameMode == 'multi') this.gameService.matchPlayer(client, payload.gameType)
        // else if (payload.gameMode == 'invite')
        // this.gameService.createInviteGame(client, payload.gameType, payload.invitedId)
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.gameService.removeDisconnectedUser(client)
    }

    @SubscribeMessage('Give-Up')
    giveUp(@ConnectedSocket() client: any, @MessageBody() player: PlayerDto) {
        this.gameService.giveUp(client)
    }

    @SubscribeMessage('Power-Up')
    PowerupStart(@ConnectedSocket() client: any, @MessageBody() type: string) {
        console.log('powerup request from clinet, type = ', type)
        this.gameService.activatePowerUp(client, type)
    }

    @SubscribeMessage('move')
    movePlayer(@ConnectedSocket() client: Socket, @MessageBody() direction: string) {
        this.gameService.movePaddle(client, direction)
    }
}
