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

    /* 
        Adds a new user to connected_users array
    */
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

    /* 
        Remove user from connected_users array and:
            * if in queue -> remove user from queue
            * if in game -> set player a loser so game will end and other player will win.
    */
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

    /* 
        Activate the power up requested by frontend
    */
    public powerUp(userSocket: Socket, powerUp: string) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if(player.game.getGameType() != 'custom') return

        player.game.powerUp(player.id, powerUp)
    }

    /* 
        called On Client's "Join-Game" event with mode = 'multi', it matches player with an opponent
    */
    public matchPlayer(userSocket: Socket, gameType: string) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (player.status != 'online') return

        player.status = 'inqueue'

        const opponent = this.findOpponent(player.id, gameType)

        if (opponent) {
            this.createMultiGame(player, opponent, gameType)
            player.status = 'ingame'
            opponent.status = 'ingame'
        }
    }

    /* 
        finds an opponent for the player in the either classic or custom queue
            * if there is an opponent -> return opponent's ConnectedUser object
            * if there is no opponent -> add player to queue and return null
        TODO: add matchmaking algorithm to find opponent with similar skill level
    */
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


    /* 
        Creates a new pongGame object with "Computer" as opponent and emit the game setup to player
    */
    public createSingleGame(player1Socket: Socket, gameType: string) {
        const player = this.connected_users.find(user => user.socket == player1Socket)
        const game = new PongGame(player.id, 'Computer', gameType)
        player.status = 'ingame'
        player.game = game
        player.socket.join(game.getGameID())
        this.socketService.emitGameSetup(player.socket, null, game.getGameStatus())

        this.startGame(game)
    }


    /* 
        Creates a new pongGame object and emit the game setup to both players
    */
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

    // end the game and emit the end game event
    public async endGame(game: PongGame, winner: PlayerDto): Promise<void> {
        const game_status = game.getGameStatus()
        this.socketService.emitToGroup(game.getGameID(), 'Game-Over', { winner, game_status })

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

    /* 
        called On client's "Invite-Game" event.
        TODO: implement this function when game is in multiplayer

        * Possible implementaiton:
        1- emit "Game-Invite" event to the invited player and wait for his response
        2- if the response is "accept" -> create a new game with the invited player

    */
    public createInviteGame(client: Socket, gameType: string, invitedID: string) {}
}
