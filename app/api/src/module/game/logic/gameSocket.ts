import { Socket } from 'socket.io'
import { gameResult } from './gameResult'
import { gameStatusDto } from '../dto/game.dto'
export class socketLogic {
    // emit the game-setup event to the players to update them with the game status
    public emitGameSetup(player1: Socket, player2: Socket, game: gameStatusDto): void {
        player1.emit('Game-Setup', { game, player: 1 })
        player2.emit('Game-Setup', { game, player: 2 })
    }

    // emit end game event to the players in case of leaving the game or winning
    public emitEndGame(client: Socket, event: string, gameResult: gameResult): void {
        client.emit(event, gameResult)
    }
}
