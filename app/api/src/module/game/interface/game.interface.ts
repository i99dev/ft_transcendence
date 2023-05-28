import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'
import { InviteDto } from '../dto/game.dto'

export interface ConnectedUser {
    login: string
    socket: Socket
    status: 'ingame' | 'inqueue' | 'online' | 'busy' | 'offline'
    game?: PongGame
    powerUps?: string[]
    pendingInvite?: InviteDto
}

export interface PowerUp {
    type: 'Hiken' | 'Baika no Jutsu' | 'Shinigami' | 'Shunshin no Jutsu'
    active: boolean
    ready: boolean
    duration: number
    cooldown: number
}
