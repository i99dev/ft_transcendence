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
import { gameResult } from '../actions/endGame'
import { PrismaService } from '@providers/prisma/prisma.service'
import { MatchHistory, User } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
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
    // private prisma: PrismaService
    private prisma = new PrismaClient()
    private user: User

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
    constructor(private defaultService: DefaultService, private jwtService: JwtService) {}
	public async createMatchHistory(): Promise<MatchHistory> {
		const matchHistoryCreate = await this.prisma.matchHistory.create({
			data: {
			  opponent: {
				connect: {
				  id: 3,
				},
			  },
			  isWinner: true,
			  at: new Date(),
			  my_score: 10,
			  op_score: 1,
			},
		  });
		  return matchHistoryCreate;
	}
    async addHistory(): Promise<void> {
		const matchHistoryCreate = await this.createMatchHistory()
		await this.prisma.user.update ({
			where: { login: 'mal-guna'},
			data: {
				match_history: { 
					connect: { id: matchHistoryCreate.id }
				},
			},
		});
    }
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
        await this.addHistory()
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
