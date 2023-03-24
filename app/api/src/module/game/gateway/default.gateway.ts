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
import { gameResult } from '../gameHistory/endGame'
import { gameHistory } from '../gameHistory/gameHistory'
@WebSocketGateway({
    namespace: '/games',
    cors: { origin: 'http://localhost/play', credentials: true },
    path: '/api/socket.io',
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private logger = new Logger('DefaultGateway')
    private gameResult: gameResult
    private gameHistory = new gameHistory()

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
    @SubscribeMessage('leave')
    async leaveGame(client: any, @MessageBody() payload: any) {
        this.gameResult = new gameResult('boo', false, 0, 0, 'You left the game')
        this.wss.emit('end-game', this.gameResult)
        await this.gameHistory.addHistory('aaljaber', 'mal-guna')
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
