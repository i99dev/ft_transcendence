import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'

export interface ConnectedUser {
    id: string
    socket: Socket
    status: 'ingame' | 'inqueue' | 'online'
    game?: PongGame
}
