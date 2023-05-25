import { Injectable } from '@nestjs/common'
import { Server, Socket } from 'socket.io'
import { gameStatusDto } from '../dto/game.dto'

@Injectable()
export class SocketService {
    private server: Server

    setServer(server: Server): void {
        this.server = server
    }

    emitToGroup(group: string, event: string, data: any): void {
        this.server.to(group).emit(event, data)
    }

    emitGameSetup(socket1: Socket, socket2: Socket, game: gameStatusDto): void {
        
        if (socket1) socket1.emit('Game-Setup', { game, player: 0 })
        if (socket2) socket2.emit('Game-Setup', { game, player: 1 })
    }

    emitAcheivement(socket: Socket, achievement: string): void {
        socket.emit('Achievement', achievement)
    }
}
