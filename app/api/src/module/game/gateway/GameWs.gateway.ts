import { Logger, UseGuards } from '@nestjs/common'
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
import { GameWsService } from './GameWs.service'
import { GameSelectDto, InviteDto, PlayerDto } from '../dto/game.dto'
import { SocketService } from './socket.service'
import { WsGuard } from '../../../common/guards/ws.guard'
import { SocketValidationPipe } from '@common/pipes/socketObjValidation.pipe'
import { PosNumberPipe } from '@common/pipes/posNumber.pipe'
import { ParseStringPipe } from '@common/pipes/string.pipe'
import { ParseSocketStringPipe } from '@common/pipes/socketString.pipe'
@WebSocketGateway({
    namespace: '/game',
    cors: { origin: '*' },
    path: '/api/socket.io',
})
export class DefaultGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server

    private logger = new Logger('DefaultGateway')
    private decoded: any

    constructor(
        private gameService: GameWsService,
        private socketService: SocketService,
        private jwtService: JwtService,
    ) { }

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

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`)
        this.gameService.removeUser(client)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Join-Game')
    async Join(
        @ConnectedSocket() client: any,
        @MessageBody(new SocketValidationPipe()) payload: GameSelectDto,
    ) {
        if (payload.gameMode == 'single') this.gameService.createSingleGame(client, payload)
        else if (payload.gameMode == 'multi') await this.gameService.matchPlayer(client, payload)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Give-Up')
    giveUp(@ConnectedSocket() client: Socket, @MessageBody() player: PlayerDto) {
        this.gameService.giveUp(client)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Power-Up')
    PowerupStart(
        @ConnectedSocket() client: Socket,
        @MessageBody(new PosNumberPipe()) powerUp: 1 | 2,
    ) {
        this.gameService.activatePowerUp(client, powerUp)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('move')
    movePlayer(
        @ConnectedSocket() client: Socket,
        @MessageBody(new ParseSocketStringPipe()) direction: 'up' | 'down',
    ) {
        this.gameService.movePaddle(client, direction)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Ready')
    ready(@ConnectedSocket() client: any,) {
        this.gameService.playerReady(client)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Send-Invite')
    sendInvite(
        @ConnectedSocket() client: any,
        @MessageBody(new SocketValidationPipe()) payload: InviteDto,
    ) {
        this.gameService.sendInvite(client, payload)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Respond-Invite')
    respondInvite(
        @ConnectedSocket() client: any,
        @MessageBody(new SocketValidationPipe()) payload: InviteDto,
    ) {
        this.gameService.respondInvite(client, payload)
    }


    @UseGuards(WsGuard)
    @SubscribeMessage('Leave-Queue')
    leaveQueue(@ConnectedSocket() client: Socket) {
        this.gameService.leaveQueue(client)
    }

    @UseGuards(WsGuard)
    @SubscribeMessage('Update-Token')
    updateToken(
        @ConnectedSocket() client: Socket,
        @MessageBody(new ParseSocketStringPipe) token: string) {
        if (token) {
            client.request.headers.authorization = 'Bearer ' + token;
        }
        else
            throw new WsException('No Refersh token provided')

    }
}