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
import { gameResult } from '../gameHistory/gameResult'
import { gameHistory } from '../gameHistory/gameHistory'
import { DefaultService } from './default.service'
import { PlayerDto } from '../dto/game.dto'
@WebSocketGateway({
    namespace: '/games',
    cors: { origin: '*' },
    path: '/api/socket.io',
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger = new Logger('DefaultGateway')
    private gameHistory = new gameHistory()

    constructor(
        private gameService: DefaultService,
        private gameResult: gameResult,
        private jwtService: JwtService,
    ) {}

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`)
        let token = client.request.headers.authorization
        token = token.split(' ')[1]
        const decoded = this.jwtService.decode(token)

        this.gameService.addToLobby(client, decoded)
        this.gameService.checkLobby((gameId, game) => {
            this.server.to(gameId).emit('Game-Data', game)
        })
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
    }
    @SubscribeMessage('Give-Up')
    async giveUp(client: any, @MessageBody() player: PlayerDto) {
        const opponent = this.gameService.Games[player.gameId].players.find(
            op => op.username !== player.username,
        )
        this.gameResult = new gameResult(
            player.username,
            false,
            player.score,
            opponent.score,
            'You left the game',
        )
        this.server.emit('Game-Over', this.gameResult)
        await this.gameHistory.addHistory(this.gameService.Games[player.gameId])
    }
    @SubscribeMessage('move')
    movePlayer(@ConnectedSocket() client: Socket, @MessageBody() direction: string) {
        this.gameService.updatePaddlePosition(client, direction)
    }
}

// await this.prisma.user.update({
//     where: { login: 'aaljaber' },
//     data: {
// 		friends: {
// 			connect: [{ login: 'bnaji' }, { login: 'isaad' }],
// 		},
// 	},
// })
// await this.prisma.user.upsert({
// 	where: { login: 'aaljaber'},
// 	update: {
// 		total_wins: 15,
// 	},
// 	create: {
// 		login: 'aaljaber',
// 		username: 'aaljaber',
// 		email: 'ss',
// 		total_loses: 0,
// 	},
// });
