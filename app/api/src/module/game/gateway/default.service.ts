import { Injectable } from '@nestjs/common'
import { gameLogic } from '../logic/gameLogic'
import { ConnectedUser } from '../interface/game.interface'
import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'
import { SocketService } from './socket.service'
import { PlayerDto, gameStatusDto } from '../dto/game.dto'
import { gameHistory } from '../logic/gameHistory'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND
const COMPUTER_FRAME_INTERVAL = 1000 / 60
const COMPUTER_SPEED = 0.0045

@Injectable()
export class DefaultService {
    // public gameLogic: gameLogic = new gameLogic()

    private connected_users: ConnectedUser[] = []
    private classic_queue: string[] = []
    private custom_queue: string[] = []

    constructor(private socketService: SocketService) {}

    public addConnectedUser(userID: string, userSocket: Socket) {
        // adds random number to username incase of duplicate names
        const temp = this.connected_users.find(user => user.id == userID)
        if (temp)
            userID = userID + "1";
        this.connected_users.push({
            id: userID,
            socket: userSocket,
            status: 'online',
        })
        // console.log("connected user with name mal-guna is " , this.connected_users.find(user => user.socket == userSocket).socket);
        console.log('Connected users number is :', this.connected_users.length)
    }

    public removeDisconnectedUser(userSocket: Socket) {
        const index = this.connected_users.findIndex(user => user.socket == userSocket)
        if (index > -1) {
            const user = this.connected_users[index];
            if(user.status == 'ingame'){
                user.game.setLoser(user.id)
            }
            else if(user.status == 'inqueue'){
                if(user.game.getGameType() == 'classic'){
                    this.classic_queue.splice(this.classic_queue.indexOf(user.id), 1)
                }
                else if(user.game.getGameType() == 'custom'){
                    this.custom_queue.splice(this.custom_queue.indexOf(user.id), 1)
                }
            }
            this.connected_users.splice(index, 1)
        }
        console.log('Connected users number is :', this.connected_users.length)
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

    public createSingleGame(player1ID: string, gameType: string) {
        const game = new PongGame(player1ID, 'Computer', gameType)
    }

    private createMultiGame(player1: ConnectedUser, player2: ConnectedUser, gameType: string) {
        const game = new PongGame(player1.id, player2.id, gameType)
        player1.game = game
        player2.game = game
        player1.socket.join(game.getGameID())
        player2.socket.join(game.getGameID())
        this.emitGameSetup(player1.socket, player2.socket, game.getGameStatus())

        this.startGame(game)
    }

    private emitGameSetup(socket1: Socket, socket2: Socket, game: gameStatusDto): void {
        socket1.emit('Game-Setup', { game, player: 0 })
        if (socket2) socket2.emit('Game-Setup', { game, player: 1 })
    }

    private startGame(game: PongGame) {
        const intervalId = setInterval(async () => {
            game.updateGame() // game logic to be added here
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

        const game_status = game.getGameStatus();
        this.emitEndGame(winner, game_status, game.getGameID())
        // dont save history if the game is against computer (It causes a crash when trying to save the game)
        if (
            this.isComputer(game_status.players[0]) ||
            this.isComputer(game_status.players[1])
        )
            return
            
        // TEMP ONLY checks wheather player1 or player 2 ends names end with number 1 if yes, removes it.
        // if (game_status.players[0][game_status.players[0].username.length - 1] == '1')
        //     game_status.players[0].username = game_status.players[0].username.slice(0, -1)
        // if (game_status.players[1][game_status.players[1].username.length - 1] == '1')
        //     game_status.players[1].username = game_status.players[1].username.slice(0, -1)

            const game_result: gameHistory = new gameHistory(game_status)

        // game_result.addHistory()

        this.clearData(game)
    }

    private clearData(game: PongGame) {
        
        const player1 = this.connected_users.find(user => user.id == game.getPlayer1ID())
        const player2 = this.connected_users.find(user => user.id == game.getPlayer2ID())
        if(player1)
        {
            player1.game = null
            player1.status = 'online'
            player1.socket.leave(game.getGameID())
        }
        if(player2)
        {
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
