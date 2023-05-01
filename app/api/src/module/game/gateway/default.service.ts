import { Injectable } from '@nestjs/common'
import { ConnectedUser } from '../interface/game.interface'
import { Socket } from 'socket.io'
import { PongGame } from '../logic/pongGame'
import { SocketService } from './socket.service'
import { GameSelectDto, PlayerDto, gameStatusDto } from '../dto/game.dto'
import { gameHistory } from '../logic/gameHistory'
import { gameAnalyzer } from '../logic/gameAnalyzer'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND

@Injectable()
export class DefaultService {
    private connected_users: ConnectedUser[] = []
    private classic_queue: string[] = []
    private custom_queue: string[] = []
    private gameAnalyzer = new gameAnalyzer()
    private game_result: gameHistory | null = null

    constructor(private socketService: SocketService) { }

    /* 
        Adds a new user to connected_users array
    */
    public addConnectedUser(userID: string, userSocket: Socket) {
        const temp = this.connected_users.find(user => user.id == userID)
        if (temp) {
            setTimeout(() => {
                userSocket.emit('Close-Tab')
                userSocket.disconnect(true)
                return
            }, 1000)
        }

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
                if (this.classic_queue.includes(user.id))
                    this.classic_queue.splice(this.classic_queue.indexOf(user.id), 1)
                if (this.custom_queue.includes(user.id))
                    this.custom_queue.splice(this.custom_queue.indexOf(user.id), 1)
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
    public activatePowerUp(userSocket: Socket, powerUp: number) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (player.game.getGameType() != 'custom') return

        player.game.activatePowerUp(player.id, powerUp)
    }

    /* 
        called On Client's "Join-Game" event with mode = 'multi', it matches player with an opponent
    */
    public matchPlayer(userSocket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (this.classic_queue.includes(player.id) || this.custom_queue.includes(player.id)) return
        if (player.status != 'online') return

        player.status = 'inqueue'
        if (gameInfo.gameType == 'custom') {
            player.powerUps = gameInfo.powerups;
        }

        const opponent = this.findOpponent(player.id, gameInfo.gameType)

        if (opponent) {
            this.createMultiGame(player, opponent, gameInfo.gameType)
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
    public createSingleGame(player1Socket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.find(user => user.socket == player1Socket)
        let game;
        if (gameInfo.gameType == 'custom') {
            game = new PongGame(player.id, "Computer", gameInfo.gameType, gameInfo.powerups, gameInfo.powerups)
        } else {
            game = new PongGame(player.id, "Computer", gameInfo.gameType)
        }
        player.status = 'ingame'
        player.game = game
        player.socket.join(game.getGameID())
        this.socketService.emitGameSetup(player.socket, null, game.getGameStatus())

        this.startGame(game)
    }

    /* 
        Remove User From Queue 
    */
    public leaveQueue(userSocket: Socket) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (!player || player.status != 'inqueue') return

        if (this.classic_queue.includes(player.id))
            this.classic_queue.splice(this.classic_queue.indexOf(player.id), 1)
        if (this.custom_queue.includes(player.id))
            this.custom_queue.splice(this.custom_queue.indexOf(player.id), 1)
        player.status = 'online'
    }

    /* 
        Creates a new pongGame object and emit the game setup to both players
    */
    private createMultiGame(player1: ConnectedUser, player2: ConnectedUser, gameType: string) {
        let game;
        if (gameType == 'custom') {
            game = new PongGame(player1.id, player2.id, gameType, player1.powerUps, player2.powerUps)
        } else {
            game = new PongGame(player1.id, player2.id, gameType)
        }

        player1.game = game
        player2.game = game
        player1.socket.join(game.getGameID())
        player2.socket.join(game.getGameID())
        this.socketService.emitGameSetup(player1.socket, player2.socket, game.getGameStatus())

        this.startGame(game)
    }

    private startGame(game: PongGame) {
        this.game_result = new gameHistory(game.getGameStatus())
        game.events.on('play-sound', (sound: string) => {
            this.socketService.emitToGroup(game.getGameID(), 'play-sound', sound)
        })

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

    public async unlockAchievement(game: PongGame, username: string) {
        const postGameAchiev = await this.gameAnalyzer.grantAchievements(username)
        const midGameAchiev = game.analyzePlayer.get(username).Achievements
        const achievements = [...postGameAchiev, ...midGameAchiev]
        console.log(achievements, achievements.length)
        if (achievements.length > 0) this.gameAnalyzer.assignAcheivments(username, achievements)
    }

    // end the game and emit the end game event
    public async endGame(game: PongGame, winner: PlayerDto): Promise<void> {
        const game_status = game.getGameStatus()
        this.socketService.emitToGroup(game.getGameID(), 'Game-Over', { winner, game_status })
        // await this.gameAnalyzer.storeAchievementAsNotification('aaljaber', 'Rookie No More')
        // dont save history if the game is against computer (It causes a crash when trying to save the game)
        if (this.isComputer(game_status.players[0]) || this.isComputer(game_status.players[1])) {
            this.clearData(game)
            return
        }

        this.game_result.addHistory()

        for (let i = 0; i < game_status.players.length; i++) {
            await this.gameAnalyzer.updatePlayerXP(
                game_status.players[i].username,
                this.game_result.IsWinner(game_status.players[i]) ? true : false,
            )
            console.log(game_status.players[i].username)
            await this.gameAnalyzer.updatePlayerLadder(game_status.players[i].username)
            await this.gameAnalyzer.updatePlayerWinningRate(game_status.players[i].username)
            await this.unlockAchievement(game, game_status.players[i].username)
        }
        this.clearData(game)
    }

    private clearData(game: PongGame) {
        const player1 = this.connected_users.find(user => user.id == game.getPlayer1ID())
        if (player1) {
            player1.game = null
            player1.status = 'online'
            player1.socket.leave(game.getGameID())
        }
        const player2 = this.connected_users.find(user => user.id == game.getPlayer2ID())
        if (player2) {
            player2.game = null
            player2.status = 'online'
            player2.socket.leave(game.getGameID())
        }
        this.game_result = null
    }

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
    // public createInviteGame(client: Socket, gameType: string, invitedID: string) {}
}
