import { Injectable } from '@nestjs/common'
import { gameStatusDto, PlayerDto, BallDto } from '../dto/game.dto'
import { Socket } from 'socket.io'

@Injectable()
export class DefaultService {
    private players: Map<string, PlayerDto> = new Map()
    private games: Map<string, gameStatusDto> = new Map()
    private lobby: Socket[] = []

    addToLobby(client: Socket, decoded: any): void {
        const player = this.createPlayer(decoded['login'])
        this.players[client.id] = player
        this.lobby.push(client)
        client.join('lobby')
        // console.log(this.players[client.id])
    }

    checkLobby(gameUpdateCallback: (gameId: string, game: gameStatusDto) => void): void {
        if (this.lobby.length >= 2) {
            let player1 = this.lobby.shift()
            let player2 = this.lobby.shift()
            let gameId = this.generateRandomId()
            this.players[player1.id].gameId = gameId
            this.players[player2.id].gameId = gameId
            let game = this.createGame(this.players[player1.id], this.players[player2.id])
            this.games[gameId] = game

            this.joinPlayersToGame(player1, player2, gameId)
            this.emitGameSetup(player1, player2, game)
            this.startGameLoop(gameId, gameUpdateCallback)
        }
    }

    createPlayer(username: string): PlayerDto {
        return {
            username,
            y: 0.5,
            score: 0,
            paddle: {
                width: 0.05,
                height: 0.2,
            },
        }
    }

    createGame(player1: PlayerDto, player2: PlayerDto): gameStatusDto {
        let game: gameStatusDto = new gameStatusDto()
        game = {
            players: [player1, player2],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Math.random() > 0.5 ? 0.0064 : -0.0064,
                dy: Math.random() > 0.5 ? 0.002 : -0.002,
                radius: 0.02,
            },
        }
        return game
    }

    joinPlayersToGame(player1: Socket, player2: Socket, gameId: string): void {
        player1.join(`${gameId}`)
        player2.join(`${gameId}`)
    }

    emitGameSetup(player1: Socket, player2: Socket, game: gameStatusDto): void {
        player1.emit('Game-Setup', { game, player: 1 })
        player2.emit('Game-Setup', { game, player: 2 })
    }

    generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }

    startGameLoop(
        gameId: string,
        gameUpdateCallback: (gameId: string, game: gameStatusDto) => void,
    ): void {
        const intervalId = setInterval(() => {
            const game = this.games[gameId]

            // if ("GameDone ?") {
            //     clearInterval(intervalId)
            //     return
            // }
            this.updateGame(gameId) // game logic to be added here
            gameUpdateCallback(gameId, game)
            if (game.players[0].score >= 11 || game.players[1].score >= 11) {
                clearInterval(intervalId)
                return
            }
        }, 1000 / 60)
    }

    updateGame(gameId: string): void {
        this.updateBall(gameId)
    }

    updateBall(gameId: string): void {
        const game = this.games[gameId]
        const { ball, players } = game

        ball.x += ball.dx
        ball.y += ball.dy
        if (ball.y < ball.radius || ball.y > 1 - ball.radius) {
            ball.dy *= -1
        }
        if (ball.x >= 1 - ball.radius) {
            if (
                ball.y <= players[1].y + players[1].paddle.height / 2 &&
                ball.y >= players[1].y - players[1].paddle.height / 2
            ) {
                ball.dx *= -1
            } else {
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
        if (ball.x <= 0 + ball.radius) {
            if (
                ball.y <= players[0].y + players[0].paddle.height / 2 &&
                ball.y >= players[0].y - players[0].paddle.height / 2
            ) {
                ball.dx *= -1
            } else {
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    resetBallPosition(ball: BallDto): void {
        ball.x = 0.5
        ball.y = 0.5
        ball.dx = Math.random() > 0.5 ? 0.0064 : -0.0064
        ball.dy = Math.random() > 0.5 ? 0.002 : -0.002
    }

    updatePaddlePosition(client: Socket, direction: string): void {
        const player = this.players[client.id]

        const game = this.games[player.gameId]
        if (!game) return

        if (direction === 'up') {
            player.y -= 0.1
        } else if (direction === 'down') {
            player.y += 0.1
        }

        player.y = Math.max(
            0 + player.paddle.height / 2,
            Math.min(1 - player.paddle.height / 2, player.y),
        )
    }
}
