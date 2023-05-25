import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'

export interface ConnectedUser {
    login: string
    socket: Socket
    status: 'ingame' | 'inqueue' | 'online' | 'busy' | 'offline'
    game?: PongGame
    powerUps?: string[]
}

export interface PowerUp {
    type: 'Hiken' | 'Baika no Jutsu' | 'Shinigami' | 'Shunshin no Jutsu'
    active: boolean
    ready: boolean
    duration: number
    cooldown: number
}
