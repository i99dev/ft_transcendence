import { Socket } from 'socket.io'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'
export class socketLogic {
    // emit the game-setup event to the players to update them with the game status
    public emitGameSetup(players: Socket[], game: gameStatusDto): void {
        players[0].emit('Game-Setup', { game, player: 1 })
        players[1].emit('Game-Setup', { game, player: 2 })
        players[0].leave('lobby')
        players[1].leave('lobby')
    }

    // emit end game event to the players in case of leaving the game or winning
    public emitEndGame(players: Socket[], winner: PlayerDto, game: gameStatusDto): void {
        players[0].emit('Game-Over', { game, winner })
        players[1].emit('Game-Over', { game, winner })
    }
}
