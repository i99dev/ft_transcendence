import { Injectable } from '@nestjs/common'
import { Server } from 'socket.io'

@Injectable()
export class SocketService {
    private server: Server

    setServer(server: Server): void {
        this.server = server
    }

    emitToGroup(group: string, event: string, data: any): void {
        this.server.to(group).emit(event, data)
    }
}
