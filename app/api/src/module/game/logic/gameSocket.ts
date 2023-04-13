import { Socket } from 'socket.io'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'
const BALL_XSPEED = 0.01
const BALL_YSPEED = 0.0
const PADDLE_WIDTH = 0.02
const PADDLE_HEIGHT = 0.2

export class socketLogic {
    private PlayersSocket: Socket[] = []
    private lobby: Socket[] = []

    public joinLobby(client: Socket, players: Map<string, PlayerDto>, decoded: any): void {
        const player = this.createPlayer(decoded['login'], 1)
        players[client.id] = player
        this.lobby.push(client)
        client.join('lobby')
    }

    public setupComputerGame(
        client: Socket,
        players: Map<string, PlayerDto>,
        games: Map<string, gameStatusDto>,
        decoded: any,
    ): string {
        const player = this.createPlayer(decoded['login'], 1)
        const computer = this.createPlayer('Computer', 2)
        const gameID: string = this.generateRandomId()

        players[client.id] = player
        players[client.id].gameID = gameID
        const game = this.instanciateGame(player, computer)
        games[gameID] = game

        client.join(gameID)
        client.emit('Game-Setup', { game, player: 1 })
        return gameID
    }

    // emit the game-setup event to the players to update them with the game status
    public emitGameSetup(game: gameStatusDto): void {
        this.PlayersSocket[0].emit('Game-Setup', { game, player: 1 })
        this.PlayersSocket[1].emit('Game-Setup', { game, player: 2 })
        this.PlayersSocket[0].leave('lobby')
        this.PlayersSocket[1].leave('lobby')
    }

    // emit end game event to the players in case of leaving the game or winning
    public emitEndGame(winner: PlayerDto, game: gameStatusDto): void {
        this.PlayersSocket[0].emit('Game-Over', { game, winner })
        this.PlayersSocket[1].emit('Game-Over', { game, winner })
    }

    // join the players to the game room
    public joinPlayersToGame(gameID: string): void {
        this.PlayersSocket[0].join(gameID)
        this.PlayersSocket[1].join(gameID)
    }

    // generate a random id for the game
    private generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }

    public createGameRoom(
        players: Map<string, PlayerDto>,
        games: Map<string, gameStatusDto>,
    ): string {
        const gameID: string = this.generateRandomId()
        this.PlayersSocket[0] = this.lobby.shift()
        this.PlayersSocket[1] = this.lobby.shift()
        players[this.PlayersSocket[0].id].gameID = gameID
        players[this.PlayersSocket[1].id].gameID = gameID

        this.assignPlayerSide(players)
        const game = this.instanciateGame(
            players[this.PlayersSocket[0].id],
            players[this.PlayersSocket[1].id],
        )
        games[gameID] = game
        this.joinPlayersToGame(gameID)
        this.emitGameSetup(game)
        return gameID
    }

    // assign the player side
    private assignPlayerSide(players: Map<string, PlayerDto>): void {
        players[this.PlayersSocket[0].id].x = PADDLE_WIDTH / 2
        players[this.PlayersSocket[1].id].x = 1 - PADDLE_WIDTH / 2
    }

    public isEnoughPlyrinLobby(): boolean {
        return this.lobby.length >= 2 ? true : false
    }

    // create a game status object
    private instanciateGame(player1: PlayerDto, player2: PlayerDto): gameStatusDto {
        let game: gameStatusDto = new gameStatusDto()
        game = {
            players: [player1, player2],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED,
                dy: Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED,
                radius: 0.02,
            },
        }
        return game
    }

    // create a new player object
    private createPlayer(username: string, side: number): PlayerDto {
        return {
            username,
            y: 0.5,
            x: side == 1 ? PADDLE_WIDTH / 2 : 1 - PADDLE_WIDTH / 2,
            score: 0,
            paddle: {
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
            },
        }
    }
    public emitAchievment(name: string): void {
        this.PlayersSocket[0].emit('achievment', name)
    }
}
