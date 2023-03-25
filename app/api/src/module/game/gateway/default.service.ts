import { Injectable } from '@nestjs/common'
import { gameStatusDto, PlayerDto, BallDto } from '../dto/game.dto'
import { Socket } from 'socket.io'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND
const PADDLE_SPEED = 0.02
const BALL_XSPEED = 0.0064
const BALL_YSPEED = 0.002

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
                dx: Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED,
                dy: Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED,
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

            this.updateGame(gameId) // game logic to be added here
            gameUpdateCallback(gameId, game)
            if (game.players[0].score >= 11 || game.players[1].score >= 11) {
                clearInterval(intervalId)
                return
            }
        }, FRAME_INTERVAL)
    }

    updateGame(gameId: string): void {
        this.updateBall(gameId)
    }

    updateBall(gameId: string): void {
        const game = this.games[gameId]

        this.moveBall(game.ball)
        this.checkBallCollision(game)
    }

    moveBall(ball: BallDto): void {
        ball.x += ball.dx
        ball.y += ball.dy
    }

    checkWallCollision(ball: BallDto): void {
        if (ball.y <= ball.radius || ball.y >= 1 - ball.radius) {
            ball.dy *= -1
        }
    }

    checkPlayerCollision(ball: BallDto, player: PlayerDto): boolean {
        if (
            ball.y - ball.radius <= player.y + player.paddle.height / 2 &&
            ball.y + ball.radius >= player.y - player.paddle.height / 2
        ) {
            return true
        }
        return false
    }

    checkBallCollision(game: gameStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)

        if (ball.x <= (ball.radius + players[0].paddle.width)) {
            if (this.checkPlayerCollision(ball, players[0])) {
                ball.dx *= -1
            } else {
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        } else if (ball.x >= 1 - (ball.radius + players[0].paddle.width)) {
            if (this.checkPlayerCollision(ball, players[1])) {
                ball.dx *= -1
            } else {
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    resetBallPosition(ball: BallDto): void {
        ball.x = 0.5
        ball.y = 0.5
        ball.dx = Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED
        ball.dy = Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED
    }

    updatePaddlePosition(client: Socket, direction: string): void {
        const player = this.players[client.id]

        const game = this.games[player.gameId]
        if (!game) return

        if (direction === 'up') {
            player.y -= PADDLE_SPEED
        } else if (direction === 'down') {
            player.y += PADDLE_SPEED
        }

        player.y = Math.max(
            0 + player.paddle.height / 2,
            Math.min(1 - player.paddle.height / 2, player.y),
        )
    }
}
///
// kkkk