import { Socket } from 'socket.io'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'
const BALL_XSPEED = 0.01
const BALL_YSPEED = 0.0
const PADDLE_WIDTH = 0.017
const PADDLE_HEIGHT = 0.2

export class socketLogic {
    private palyersSocket: Socket[] = []
    private lobby: Socket[] = []

    public joinLobby(client: Socket, players: Map<string, PlayerDto>, decoded: any): void {
        const player = this.createPlayer(decoded['login'])
        players[client.id] = player
        this.lobby.push(client)
        client.join('lobby')
    }

    public setupComputerGame(client: Socket, players: Map<string, PlayerDto>, games: Map<string, gameStatusDto>, decoded: any): string{
        const player = this.createPlayer(decoded['login'])
        const computer = this.createPlayer('Computer')
        const gameID: string = this.generateRandomId()

        players[client.id] = player
        players[client.id].gameID = gameID
        const game = this.instanciateGame(
            player,
            computer,
        )
        games[gameID] = game 
    
        client.join(gameID)
        client.emit('Game-Setup', { game, player: 1 })
        return gameID;
    }

    // emit the game-setup event to the players to update them with the game status
    public emitGameSetup(players: Socket[], game: gameStatusDto): void {
        this.palyersSocket[0].emit('Game-Setup', { game, player: 1 })
        this.palyersSocket[1].emit('Game-Setup', { game, player: 2 })
        this.palyersSocket[0].leave('lobby')
        this.palyersSocket[1].leave('lobby')
    }

    // emit end game event to the players in case of leaving the game or winning
    public emitEndGame(players: Socket[], winner: PlayerDto, game: gameStatusDto): void {
        this.palyersSocket[0].emit('Game-Over', { game, winner })
        this.palyersSocket[1].emit('Game-Over', { game, winner })
    }

    // join the players to the game room
    public joinPlayersToGame(players: Socket[], gameId: string): void {
        this.palyersSocket[0].join(gameId)
        this.palyersSocket[1].join(gameId)
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
        this.palyersSocket[0] = this.lobby.shift()
        this.palyersSocket[1] = this.lobby.shift()
        players[this.palyersSocket[0].id].gameID = gameID
        players[this.palyersSocket[1].id].gameID = gameID
        const game = this.instanciateGame(
            players[this.palyersSocket[0].id],
            players[this.palyersSocket[1].id],
        )
        games[gameID] = game
        this.joinPlayersToGame(this.palyersSocket, gameID)
        this.emitGameSetup(this.palyersSocket, game)
        return gameID
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
    private createPlayer(username: string): PlayerDto {
        return {
            username,
            y: 0.5,
            score: 0,
            paddle: {
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
            },
        }
    }
}
