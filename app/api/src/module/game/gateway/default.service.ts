import { Injectable } from '@nestjs/common'
import { ConnectedUser } from '../interface/game.interface'
import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'
import { SocketService } from './socket.service'
import { PlayerDto, gameStatusDto } from '../dto/game.dto'
import { gameHistory } from '../logic/gameHistory'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND

@Injectable()
export class DefaultService {
    private connected_users: ConnectedUser[] = []
    private classic_queue: string[] = []
    private custom_queue: string[] = []

    constructor(private socketService: SocketService) {}

    public addConnectedUser(userID: string, userSocket: Socket) {
        const temp = this.connected_users.find(user => user.id == userID)
        // temp.. adds a random number to the end of username if its already there
        if (temp) userID = userID + Math.floor(Math.random() * 100)

        this.connected_users.push({
            id: userID,
            socket: userSocket,
            status: 'online',
        })
    }

    // Once a user disconects, it removes him from the connected users array
    // if in game -> set loser
    // if in queue -> remove from queue
    public removeDisconnectedUser(userSocket: Socket) {
        const index = this.connected_users.findIndex(user => user.socket == userSocket)
        if (index > -1) {
            const user = this.connected_users[index]
            if (user.status == 'inqueue') {
                if (user.game.getGameType() == 'classic') {
                    this.classic_queue.splice(this.classic_queue.indexOf(user.id), 1)
                } else if (user.game.getGameType() == 'custom') {
                    this.custom_queue.splice(this.custom_queue.indexOf(user.id), 1)
                }
            } else if (user.status == 'ingame') {
                user.game.setLoser(user.id)
            }
            this.connected_users.splice(index, 1)
        }
    }

    public giveUp(userSocket: Socket) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        player.game.setLoser(player.id)
    }

    public powerUp(userSocket: Socket, powerUp: string) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        player.game.powerUp(player.id, powerUp)
    }

    public matchPlayer(userSocket: Socket, gameType: string) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        player.status = 'inqueue'

        const opponent = this.findOpponent(player.id, gameType)

        if (opponent) {
            this.createMultiGame(player, opponent, gameType)
            player.status = 'ingame'
            opponent.status = 'ingame'
        }
    }

    private findOpponent(userID: string, gameType: string): ConnectedUser | null {
        if (gameType == 'classic') {
            if (this.classic_queue.length > 0) {
                const opponent = this.classic_queue.shift()
                return this.connected_users.find(user => user.id == opponent)
            } else {
                this.classic_queue.push(userID)
                return null
            }
        } else if (gameType == 'custom') {
            if (this.custom_queue.length > 0) {
                const opponent = this.custom_queue.shift()
                return this.connected_users.find(user => user.id == opponent)
            } else {
                this.custom_queue.push(userID)
                return null
            }
        }
    }

    public createSingleGame(player1Socket: Socket, gameType: string) {
        const player = this.connected_users.find(user => user.socket == player1Socket)
        const game = new PongGame(player.id, 'Computer', gameType)
        player.status = 'ingame'
        player.game = game
        player.socket.join(game.getGameID())
        this.socketService.emitGameSetup(player.socket, null, game.getGameStatus())

        this.startGame(game)
    }

    private createMultiGame(player1: ConnectedUser, player2: ConnectedUser, gameType: string) {
        const game = new PongGame(player1.id, player2.id, gameType)
        player1.game = game
        player2.game = game
        player1.socket.join(game.getGameID())
        player2.socket.join(game.getGameID())
        this.socketService.emitGameSetup(player1.socket, player2.socket, game.getGameStatus())

        this.startGame(game)
    }

    private startGame(game: PongGame) {
        const intervalId = setInterval(async () => {
            if (game.getGameStatus().players[1].username == 'Computer') game.updateComputer()

            game.updateGame()
            this.socketService.emitToGroup(game.getGameID(), 'Game-Data', game.getGameStatus())
            if (game.getPlayer1Score() >= 11 || game.getPlayer2Score() >= 11) {
                clearInterval(intervalId)
                await this.endGame(
                    game,
                    game.getPlayer1Score() >= 11
                        ? game.getGameStatus().players[0]
                        : game.getGameStatus().players[1],
                )
                return
            }
        }, FRAME_INTERVAL)
    }

    public movePaddle(socket: Socket, direction: string) {
        const player = this.connected_users.find(user => user.socket == socket)
        if (player.status == 'ingame') {
            player.game.updatePaddlePosition(player.id, direction)
        }
    }

    // emit end game event to the players in case of leaving the game or winning
    public emitEndGame(winner: PlayerDto, game: gameStatusDto, game_id: string): void {
        this.socketService.emitToGroup(game_id, 'Game-Over', { winner, game })
    }

    // end the game and emit the end game event
    public async endGame(game: PongGame, winner: PlayerDto): Promise<void> {
        const game_status = game.getGameStatus()
        this.emitEndGame(winner, game_status, game.getGameID())

        // dont save history if the game is against computer (It causes a crash when trying to save the game)
        if (this.isComputer(game_status.players[0]) || this.isComputer(game_status.players[1])) {
            this.clearData(game)
            return
        }

        // Temporarily commented out, it crashes when adding game history for non-existent user (I add numbers to usernames when 2 players have the same username)
        // const game_result: gameHistory = new gameHistory(game_status)
        // game_result.addHistory()

        this.clearData(game)
    }

    private clearData(game: PongGame) {
        const player1 = this.connected_users.find(user => user.id == game.getPlayer1ID())
        const player2 = this.connected_users.find(user => user.id == game.getPlayer2ID())
        if (player1) {
            player1.game = null
            player1.status = 'online'
            player1.socket.leave(game.getGameID())
        }
        if (player2) {
            player2.game = null
            player2.status = 'online'
            player2.socket.leave(game.getGameID())
        }
    }

    // check if the player is a computer
    private isComputer(player: PlayerDto): boolean {
        return player.username === 'Computer'
    }

    public createInviteGame(client: Socket, gameType: string, invitedID: string) {}
}
