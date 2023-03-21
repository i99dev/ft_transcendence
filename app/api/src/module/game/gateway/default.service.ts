import { Injectable } from '@nestjs/common'
import { GameStausDto, PlayerDto } from '../dto/game.dto'
import { Socket } from 'socket.io'

@Injectable()
export class DefaultService {
    private players: Map<string, PlayerDto> = new Map()
    private games: Map<string, GameStausDto> = new Map()
    private lobby: Socket[] = []

    addToLobby(client: Socket, decoded: any): void {
        let player: PlayerDto = new PlayerDto()
        player = {
            username: decoded['login'],
            y: 0.5,
            score: 0,
            paddle: {
                width: 0.05,
                height: 0.2,
            },
        }
        this.players[client.id] = player
        this.lobby.push(client)
        client.join('lobby')
        console.log(this.players[client.id])
    }

    checkLobby(gameUpdateCallback: (gameId: string, game: GameStausDto) => void): void {
        if (this.lobby.length >= 2) {
            let player1 = this.lobby.shift()
            let player2 = this.lobby.shift()
            let gameId = this.generateRandomId()
            this.players[player1.id].gameId = gameId
            this.players[player2.id].gameId = gameId
            let game = this.createGame(this.players[player1.id], this.players[player2.id])
            this.games[gameId] = game
            player1.join(`${gameId}`)
            player2.join(`${gameId}`)
            player1.emit('Game-Setup', { game, player: 1 })
            player2.emit('Game-Setup', { game, player: 2 })
            this.startGameLoop(gameId, gameUpdateCallback)
        }
    }
    createGame(player1: PlayerDto, player2: PlayerDto): GameStausDto {
        let game: GameStausDto = new GameStausDto()
        game = {
            players: [player1, player2],
            ball: {
                x: 0.5,
                y: 0.5,
                radius: 0.02,
            },
        }
        return game
    }

    generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }
    startGameLoop(
        gameId: string,
        gameUpdateCallback: (gameId: string, game: GameStausDto) => void,
    ): void {
        const intervalId = setInterval(() => {
            const game = this.games[gameId]

            // this.updateGame(gameId); // game logic to be added here

            gameUpdateCallback(gameId, game)
        }, 5000)
    }

    updatePaddlePosition(client: Socket, direction: string): void {
        const player = this.players[client.id]

        const game = this.games[player.gameId]
        if (!game) return

        if (direction === 'up') {
            player.y += 0.1
        } else if (direction === 'down') {
            player.y -= 0.1
        }

        player.y = Math.max(0.2, Math.min(1 - player.paddle.height, player.y))
    }
}
