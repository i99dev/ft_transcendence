import { Injectable } from '@nestjs/common'
import { ConnectedUser } from '../interface/game.interface'
import { Socket } from 'socket.io'
import { SocketService } from './socket.service'
import { GameSelectDto, InviteDto, PlayerDto } from '../dto/game.dto'
import { GameRepository } from '../repository/game.repository'
import { gameAnalyzer } from '../logic/gameAnalyzer'
import { PongGame } from '../logic/pongGame'
import { gameHistory } from '../logic/gameHistory'
import { PrismaService } from '@providers/prisma/prisma.service'
import { UserService } from '@module/user/user.service'
import { MatchService } from '@module/match/match.service'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND

@Injectable()
export class GameWsService {
    private connected_users: ConnectedUser[] = []
    private classic_queue: string[] = []
    private custom_queue: string[] = []
    private game_result: gameHistory | null = null
    private repo: GameRepository = new GameRepository()
    private emitDeuce = false

    constructor(
        private socketService: SocketService,
        private gameAnalyzer: gameAnalyzer,
        private prisma: PrismaService,
        private userService: UserService,
        private matchService: MatchService,
    ) {}

    /* 
        Adds a new user to connected_users array
    */
    public addConnectedUser(userLogin: string, userSocket: Socket) {
        const temp = this.connected_users.find(user => user.login == userLogin)
        if (temp) {
            setTimeout(() => {
                userSocket.emit('Close-Tab')
                userSocket.disconnect(true)
                return
            }, 1000)
        }

        this.connected_users.push({
            login: userLogin,
            socket: userSocket,
            status: 'online',
        })
        this.repo.updatePlayerStatus('ONLINE', userLogin)
    }

    /* 
        Remove user from connected_users array and:
            * if in queue -> remove user from queue
            * if in game -> set player a loser so game will end and other player will win.
    */
    public removeUser(userSocket: Socket) {
        const index = this.connected_users.findIndex(user => user.socket == userSocket)
        if (index > -1) {
            const user = this.connected_users[index]
            if (user.status == 'inqueue') {
                if (this.classic_queue.includes(user.login))
                    this.classic_queue.splice(this.classic_queue.indexOf(user.login), 1)
                if (this.custom_queue.includes(user.login))
                    this.custom_queue.splice(this.custom_queue.indexOf(user.login), 1)
            } else if (user.status == 'ingame') {
                user.game.setLoser(user.login)
            }
            this.connected_users.splice(index, 1)
            this.repo.updatePlayerStatus('OFFLINE', user.login)
        }
    }

    public giveUp(userSocket: Socket) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (player && player.status == 'ingame') {
            player.game.setLoser(player.login)
            player.game.leaver = player.login
        }
    }

    /* 
        Activate the power up requested by frontend
    */
    public activatePowerUp(userSocket: Socket, powerUp: number) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (player.game.getGameType() != 'custom') return

        player.game.activatePowerUp(player.login, powerUp)
    }

    /* 
        called On Client's "Join-Game" event with mode = 'multi', it matches player with an opponent
    */
    public async matchPlayer(userSocket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (this.classic_queue.includes(player.login) || this.custom_queue.includes(player.login))
            return
        if (player.status != 'online') return

        player.status = 'inqueue'
        this.repo.updatePlayerStatus('INQUEUE', player.login)
        if (gameInfo.gameType == 'custom') {
            player.powerUps = gameInfo.powerups
        }

        const opponent = await this.findOpponent(player.login, gameInfo.gameType)

        if (opponent) {
            this.createMultiGame(player, opponent, gameInfo.gameType)
            player.status = 'ingame'
            opponent.status = 'ingame'
        }
    }

    public sendInvite(userSocket: Socket, invite: InviteDto) {
        const user = this.connected_users.find(user => user.socket == userSocket)
        const opponent = this.connected_users.find(user => user.login == invite.invitedId)
        user.powerUps = invite.powerups
        invite.inviterId = user.login
        if (opponent && opponent.status == 'online') {
            // If the invite was successfuly sent to the opponent
            user.status = 'busy'
            opponent.status = 'busy'
            opponent.socket.emit('Invite-Received', invite)
        } else if (opponent) {
            // Incase user it not online or not found
            userSocket.emit('Respond-Invite', { status: 'rejected', playerStatus: opponent.status })
        } else {
            userSocket.emit('Respond-Invite', { status: 'rejected', playerStatus: 'offline' })
        }
    }

    /* Respond to the inviter with either Accept or Decline */
    public respondInvite(userSocket: Socket, response: InviteDto, error?: boolean) {
        const user = this.connected_users.find(user => user.socket == userSocket)
        const opponent = this.connected_users.find(user => user.login == response.inviterId)
        if (error) {
            if (user.status == 'busy') user.status = 'online'
            if (opponent.status == 'busy') opponent.status = 'online'
            userSocket.emit('Respond-Invite', { status: 'error', playerStatus: opponent.status })
            return
        }
        if (opponent) {
            if (response.accepted == true) {
                opponent.socket.emit('Respond-Invite', {
                    status: 'accepted',
                    playerStatus: user.status,
                })
                user.powerUps = response.powerups
                this.createMultiGame(opponent, user, response.gameType)
                user.status = 'ingame'
                opponent.status = 'ingame'
            } else {
                opponent.status = 'online'
                user.status = 'online'
                opponent.socket.emit('Respond-Invite', {
                    status: 'rejected',
                    playerStatus: user.status,
                })
            }
        } else user.status = 'online'
    }

    public playerReady(userSocket: Socket) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (player && player.status != 'ingame') return
        player.game.setPlayerReady(player.login)
    }

    /* 
        finds an opponent for the player in the either classic or custom queue
            * if there is an opponent -> return opponent's ConnectedUser object
            * if there is no opponent -> add player to queue and return null
        TODO: add matchmaking algorithm to find opponent with similar skill level
    */
    private async findOpponent(userLogin: string, gameType: string): Promise<ConnectedUser | null> {
        // const userLadder = await this.gameAnalyzer.getLadderLevel(userLogin)
        // let opponent = ''
        if (gameType == 'classic') {
            if (this.classic_queue.length > 0) {
                const opponent = this.classic_queue.shift()
                // this.classic_queue.forEach(async (user: string) => {
                //     const ladderLevel = await this.gameAnalyzer.getLadderLevel(user)
                //     if (ladderLevel === userLadder) {
                //         opponent = userLogin
                //         return
                //     }
                // })
                return this.connected_users.find(user => user.login == opponent)
            } else {
                this.classic_queue.push(userLogin)
                return null
            }
        } else if (gameType == 'custom') {
            if (this.custom_queue.length > 0) {
                const opponent = this.custom_queue.shift()
                // this.classic_queue.forEach(async (user: string) => {
                //     const ladderLevel = await this.gameAnalyzer.getLadderLevel(user)
                //     if (ladderLevel === userLadder) {
                //         opponent = userLogin
                //         return
                //     }
                // })
                return this.connected_users.find(user => user.login == opponent)
            } else {
                this.custom_queue.push(userLogin)
                return null
            }
        }
    }

    /* 
        Creates a new pongGame object with "Computer" as opponent and emit the game setup to player
    */
    public createSingleGame(player1Socket: Socket, gameInfo: GameSelectDto) {
        const player = this.connected_users.find(user => user.socket == player1Socket)
        let game
        if (gameInfo.gameType == 'custom') {
            game = new PongGame(
                player.login,
                'Computer',
                gameInfo.gameType,
                gameInfo.powerups,
                gameInfo.powerups,
            )
        } else {
            game = new PongGame(player.login, 'Computer', gameInfo.gameType)
        }
        player.status = 'ingame'
        this.repo.updatePlayerStatus('INGAME', player.login)
        player.game = game
        player.socket.join(game.getGameID())

        this.initiateGame(game, player, null)

        this.startGame(game)
    }

    /* 
        Remove User From Queue 
    */
    public leaveQueue(userSocket: Socket) {
        const player = this.connected_users.find(user => user.socket == userSocket)
        if (!player || player.status != 'inqueue') return

        if (this.classic_queue.includes(player.login))
            this.classic_queue.splice(this.classic_queue.indexOf(player.login), 1)
        if (this.custom_queue.includes(player.login))
            this.custom_queue.splice(this.custom_queue.indexOf(player.login), 1)

        player.status = 'online'
        this.repo.updatePlayerStatus('ONLINE', player.login)
    }

    /* 
        Creates a new pongGame object and emit the game setup to both players
    */
    private createMultiGame(
        player1: ConnectedUser,
        player2: ConnectedUser,
        gameType: string,
        gameMode?: string,
    ) {
        let game
        if (gameType == 'custom') {
            game = new PongGame(
                player1.login,
                player2.login,
                gameType,
                player1.powerUps,
                player2.powerUps,
            )
        } else {
            game = new PongGame(player1.login, player2.login, gameType)
        }

        player1.game = game
        player2.game = game
        player1.socket.join(game.getGameID())
        player2.socket.join(game.getGameID())
        this.repo.updatePlayerStatus('INGAME', player1.login)
        this.repo.updatePlayerStatus('INGAME', player2.login)
        player1.status = 'ingame'
        player2.status = 'ingame'
        this.initiateGame(game, player1, player2)
        this.startGame(game)
    }

    private initiateGame(game: PongGame, p1: ConnectedUser, p2: ConnectedUser) {
        const player1Socket = p1.socket
        const player1Login = p1.login
        const player2Socket = p2 ? p2.socket : null
        const player2Login = p2 ? p2.login : 'Computer'
        const gameStatus = game.getGameStatus()
        let i = 800
        const intervalId = setInterval(() => {
            if (game.isPlayersReady() || game.checkWinner() || i <= 0) {
                clearInterval(intervalId)
                return
            }
            if (!game.isPlayersReady()) {
                this.socketService.emitGameSetup(player1Socket, null, gameStatus)
            }
            if (!game.isPlayersReady(player2Login))
                this.socketService.emitGameSetup(null, player2Socket, gameStatus)
            i--
        }, 1000 / 60)
    }

    private startGame(game: PongGame) {
        this.game_result = new gameHistory(
            game.getGameStatus(),
            this.prisma,
            this.userService,
            this.matchService,
        )
        game.events.on('play-sound', (sound: string) => {
            this.socketService.emitToGroup(game.getGameID(), 'play-sound', sound)
        })
        game.events.on('Game-Deuce', () => {
            this.socketService.emitToGroup(game.getGameID(), 'Game-Deuce', game.getGameStatus())
        })

        const intervalId = setInterval(async () => {
            if (game.isPlayersReady()) {
                game.updateGame()
                this.socketService.emitToGroup(game.getGameID(), 'Game-Data', game.getGameStatus())
            }
            if (game.checkWinner()) {
                clearInterval(intervalId)
                await this.endGame(game, game.getWinner())
                return
            }
        }, FRAME_INTERVAL)
    }

    public movePaddle(socket: Socket, direction: string) {
        const player = this.connected_users.find(user => user.socket == socket)
        if (player.status == 'ingame') {
            player.game.updatePaddlePosition(player.login, direction)
        }
    }

    public async unlockAchievement(game: PongGame, login: string) {
        const postGameAchiev = await this.gameAnalyzer.grantAchievements(login)
        const midGameAchiev = game.analyzePlayer.get(login).Achievements
        const achievements = [...postGameAchiev, ...midGameAchiev]
        if (achievements.length > 0) this.gameAnalyzer.assignAcheivments(login, achievements)
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
        if (game.leaver == undefined) {
            this.game_result?.addHistory()

            for (let i = 0; i < game_status.players.length; i++) {
                await this.gameAnalyzer.updatePlayerXP(
                    game_status.players[i].login,
                    this.game_result.IsWinner(game_status.players[i]) ? true : false,
                )
                await this.gameAnalyzer.updatePlayerLadder(game_status.players[i].login)
                await this.gameAnalyzer.updatePlayerWinningRate(game_status.players[i].login)
                await this.unlockAchievement(game, game_status.players[i].login)
            }
        } else {
            const punished = game.leaver
            await this.gameAnalyzer.paunishPlayer(punished)
            await this.gameAnalyzer.compensatePlayer(
                punished === game_status.players[0].login
                    ? game_status.players[1].login
                    : game_status.players[0].login,
            )
        }
        this.clearData(game)
    }

    private clearData(game: PongGame) {
        const player1 = this.connected_users.find(user => user.login == game.getPlayer1ID())
        if (player1) {
            player1.game = null
            player1.status = 'online'
            this.repo.updatePlayerStatus('ONLINE', player1.login)
            player1.socket.leave(game.getGameID())
        }
        const player2 = this.connected_users.find(user => user.login == game.getPlayer2ID())
        if (player2) {
            player2.game = null
            player2.status = 'online'
            this.repo.updatePlayerStatus('ONLINE', player2.login)
            player2.socket.leave(game.getGameID())
        }
        this.game_result = null
    }

    private isComputer(player: PlayerDto): boolean {
        return player.login === 'Computer'
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
