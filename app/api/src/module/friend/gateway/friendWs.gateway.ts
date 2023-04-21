import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io'
import { FriendWsService } from "./friendWs.service";
import { Logger } from "@nestjs/common";
import { NotificationService } from "@module/notification/notification.service";
import { FriendService } from "../friend.service";
import { SocketValidationPipe } from "@common/pipes/socketObjValidation.pipe";



@WebSocketGateway({
    namespace: '/friend',
    cors: { origin: '*' },
    path: '/api/socket.io',
})
export class FriendWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    wss: Server

    private clients: Map<string, string> = new Map()
    private sockets: Map<string, Socket> = new Map()

    private logger = new Logger('FriendWsGateway')

    constructor(private friendWsService: FriendWsService, private notification: NotificationService, private friendService: FriendService) {}

    handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client "${client.id}" connected to friends`)
        this.clients.set(this.getID(client) as unknown as string, client.id)
        this.sockets.set(client.id, client)
        this.notification.setUpNotificationMessage(client, this.friendWsService.getMyNotificationsFriends(this.getID(client) as unknown as string))
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client "${client.id}" disconnected from friends`)
        const user_login: string = this.getID(client) as string
        this.clients.delete(user_login)
        this.sockets.delete(client.id)
    }

    @SubscribeMessage('add-friend')
    async sendMessage( @ConnectedSocket() client: Socket, @MessageBody(new SocketValidationPipe()) payload: any){
        if (await this.friendWsService.checkIfFriend(this.getID(client) as string, payload.friend_login))
            return (this.socketError('already friends'), [])
        if (await this.friendService.checkAddedFriends(this.getID(client) as string, payload.friend_login))
            return (this.socketError('already have sent a request'), [])
        if (!(await this.friendService.CheckFriendsUpdate(this.getID(client) as string, payload.friend_login)))
            return (this.socketError('error adding friend'), [])
        if (!(await this.friendService.checkAddedFriends(payload.friend_login, this.getID(client) as string))) {
            const notification = await this.notification.createNotification({
                user_login: payload.friend_login,
                content: `${this.getID(client)} wants to be your friend`,
                type: 'FRIEND_REQUEST',
                target: this.getID(client) as string,
            })
            if (notification) {
                const socket = this.getSocket(payload.friend_login)
                if (socket) {
                    this.notification.setUpNotificationMessage(socket, notification)
                    socket.emit('add-friend', { content: `${this.getID(client)} wants to be your friend`})
                }
                client.emit('add-friend', { content: `friend request sent to ${payload.friend_login }`})
                return notification
            }
        }
        else {
            const notification = await this.notification.createNotification({
                user_login: payload.friend_login,
                content: `${this.getID(client)} accepted your friend request`,
                type: 'FRIEND_REQUEST_ACCEPTED',
                target: this.getID(client) as string,
            })
            if (notification) {
                const socket = this.getSocket(payload.friend_login)
                if (socket) {
                    this.notification.setUpNotificationMessage(socket, notification)
                    socket.emit('add-friend', { content: `${this.getID(client)} accepted your friend request` })
                    socket.emit('friends-list', await this.friendService.getFriends(payload.friend_login))
                }
                client.emit('add-friend', { content: `friend request accepted from ${payload.friend_login}` })
                client.emit('friends-list', await this.friendService.getFriends(this.getID(client) as string))
                return notification
            }
        }
    }

    @SubscribeMessage('delete-friend')
    async deleteFriend( @ConnectedSocket() client: Socket, @MessageBody(new SocketValidationPipe()) payload: any) {
        if (!(await this.friendWsService.checkIfFriend(this.getID(client) as string, payload.friend_login)))
            return (this.socketError('not friends already'), [])
    }

    getSocket(user): Socket {
        const clientId = this.clients.get(user)
        if (clientId) return this.sockets.get(clientId)
    }

    socketError(error: string) {
        this.logger.error(error)
        throw new WsException(error)
    }

    getID(client: Socket) {
        let user: string
        if (client.handshake.query.user_login) user = client.handshake.query.user_login.toString()
        if (!user) {
            user = this.friendWsService.extractUserFromJwt(client.handshake.headers.authorization)
            if (!user) {
                this.logger.error('Invalid token')
                return client.disconnect()
            }
        }
        return user
    }
}