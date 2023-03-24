import { gameStatusDto, PlayerDto, BallDto } from '../dto/game.dto'
import { Socket } from 'socket.io'
import { gameHistory } from './gameHistory'
import { gameResult } from './gameResult'
import { socketLogic } from './gameSocket'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND
const PADDLE_SPEED = 0.02
const BALL_XSPEED = 0.0064
const BALL_YSPEED = 0.002

export class gameLogic {
    private players: Map<string, PlayerDto> = new Map()
    private games: Map<string, gameStatusDto> = new Map()
    private lobby: Socket[] = []
    private gameHistory = new gameHistory()
    private gameResult: gameResult
    private socketLogic = new socketLogic()

    public get Players(): Map<string, PlayerDto> {
        return this.players
    }

    public get Games(): Map<string, gameStatusDto> {
        return this.games
    }

    public addToLobby(client: Socket, decoded: any): void {
        const player = this.createPlayer(decoded['login'])
        this.players[client.id] = player
        this.lobby.push(client)
        client.join('lobby')
    }

    // check if there are enough players in the lobby to start a game and create the game if so
    public checkLobby(gameUpdateCallback: (gameId: string, game: gameStatusDto) => void): void {
        if (this.lobby.length >= 2) {
            const player1 = this.lobby.shift()
            const player2 = this.lobby.shift()
            const gameId = this.generateRandomId()
            this.players[player1.id].gameId = gameId
            this.players[player2.id].gameId = gameId
            const game = this.createGame(this.players[player1.id], this.players[player2.id])
            this.games[gameId] = game
            this.joinPlayersToGame(player1, player2, gameId)
            this.socketLogic.emitGameSetup(player1, player2, game)
            this.startGameLoop(gameId, gameUpdateCallback)
        }
    }

    // create a new player object
    private createPlayer(username: string): PlayerDto {
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

    // create a game status object
    private createGame(player1: PlayerDto, player2: PlayerDto): gameStatusDto {
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

    // join the players to the game room
    private joinPlayersToGame(player1: Socket, player2: Socket, gameId: string): void {
        player1.join(`${gameId}`)
        player2.join(`${gameId}`)
    }

    // generate a random id for the game
    private generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }

    // start the game loop through the logic of the game and ends in case of a win
    private startGameLoop(
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

    // update the game by updating the ball position and checking for collisions
    private updateGame(gameId: string): void {
        this.updateBall(gameId)
    }

    // update the ball position and check for collisions
    private updateBall(gameId: string): void {
        const game = this.games[gameId]

        this.moveBall(game.ball)
        this.checkBallCollision(game)
    }

    // move the ball to the next position
    private moveBall(ball: BallDto): void {
        ball.x += ball.dx
        ball.y += ball.dy
    }

    // reset the ball position that is out of bounds to the center
    private checkWallCollision(ball: BallDto): void {
        if (ball.y <= ball.radius || ball.y >= 1 - ball.radius) {
            ball.dy *= -1
        }
    }

    // check if the ball collided with a player paddle
    private checkPlayerCollision(ball: BallDto, player: PlayerDto): boolean {
        if (
            ball.y - ball.radius <= player.y + player.paddle.height / 2 &&
            ball.y + ball.radius >= player.y - player.paddle.height / 2
        ) {
            return true
        }
        return false
    }

    // check if the ball collided with a player paddle and update the score if it is out of bounds
    private checkBallCollision(game: gameStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)

        if (ball.x <= ball.radius + players[0].paddle.width) {
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

    // reset the ball position to the center
    private resetBallPosition(ball: BallDto): void {
        ball.x = 0.5
        ball.y = 0.5
        ball.dx = Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED
        ball.dy = Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED
    }

    // update the paddle position of the player based on the direction
    public updatePaddlePosition(client: Socket, direction: string): void {
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

    public async endGame(
        client: Socket,
        player: PlayerDto,
        reason: string,
        isWinner,
    ): Promise<void> {
        const opponent = this.games[player.gameId].players.find(
            op => op.username !== player.username,
        )
        this.gameResult = new gameResult(
            player.username,
            isWinner,
            player.score,
            opponent.score,
            reason,
        )
        this.socketLogic.emitEndGame(client, isWinner ? 'Game-Over' : 'End-Game', this.gameResult)
        await this.gameHistory.addHistory(this.games[player.gameId])
    }
}
