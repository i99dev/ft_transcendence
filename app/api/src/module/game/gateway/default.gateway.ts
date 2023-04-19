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
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { DefaultService } from './default.service'
import { GameSelectDto, PlayerDto } from '../dto/game.dto'
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

    constructor(private gameService: DefaultService, private jwtService: JwtService) {}
    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`)
        let token = client.request.headers.authorization
        token = token.split(' ')[1]
        this.decoded = this.jwtService.decode(token)
    }

    @SubscribeMessage('Join-game')
    Join(@ConnectedSocket() client: any, @MessageBody() payload: GameSelectDto) {
        if ( payload.gameMode == 'single') {
            this.gameService.gameLogic.startComputerGame(client, this.decoded, (gameId, game) => {
                this.server.to(gameId).emit('Game-Data', game)
            })
        } else if (payload.gameMode == 'multi') {
            this.gameService.gameLogic.addToLobby(client, this.decoded)
            this.gameService.gameLogic.checkLobby((gameId, game) => {
                this.server.to(gameId).emit('Game-Data', game)
            })
        }
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }

    @SubscribeMessage('Give-Up')
    async giveUp(@ConnectedSocket() client: any, @MessageBody() player: PlayerDto) {
        await this.gameService.gameLogic.endGame(player, false)
    }

    @SubscribeMessage('powerup')
    PowerupStart(@ConnectedSocket() client: any, @MessageBody() action: string) {
        console.log('powerup', action)
        this.gameService.gameLogic.powerup(client, action)
    }

    @SubscribeMessage('move')
    movePlayer(@ConnectedSocket() client: Socket, @MessageBody() direction: string) {
        this.gameService.gameLogic.updatePaddlePosition(client, direction)
    }
}
