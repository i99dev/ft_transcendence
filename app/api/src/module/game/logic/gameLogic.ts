/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameLogic.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: aaljaber <aaljaber@student.42abudhabi.a    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/25 08:07:46 by aaljaber          #+#    #+#             */
/*   Updated: 2023/04/02 09:44:33 by aaljaber         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { gameStatusDto, PlayerDto, BallDto } from '../dto/game.dto'
import { Socket } from 'socket.io'
import { gameHistory } from './gameHistory'
import { socketLogic } from './gameSocket'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND
const COMPUTER_FRAME_INTERVAL = 1000 / 60
const COMPUTER_SPEED = 0.0045
const PADDLE_SPEED = 0.03
const REFLECT_ANGLE = 80
const BALL_XSPEED = 0.01
const BALL_YSPEED = 0.0

export class gameLogic {
    private players: Map<string, PlayerDto> = new Map()
    private games: Map<string, gameStatusDto> = new Map()
    private socketLogic = new socketLogic()
    private playersSocket: Socket[] = []

    public get Players(): Map<string, PlayerDto> {
        return this.players
    }

    public get Games(): Map<string, gameStatusDto> {
        return this.games
    }

    public addToLobby(client: Socket, decoded: any): void {
        this.socketLogic.joinLobby(client, this.players, decoded)
    }

    // check if there are enough players in the lobby to start a game and create the game if so
    public checkLobby(gameUpdateCallback: (gameId: string, game: gameStatusDto) => void) {
        if (this.socketLogic.isEnoughPlyrinLobby()) {
            this.startGameLoop(
                this.socketLogic.createGameRoom(this.players, this.Games),
                gameUpdateCallback,
            )
        }
    }

    public startComputerGame(
        client: Socket,
        decoded: any,
        gameUpdateCallback: (gameId: string, game: gameStatusDto) => void,
    ): void {
        const gameId: string = this.socketLogic.setupComputerGame(
            client,
            this.players,
            this.games,
            decoded,
        )
        this.startGameLoop(gameId, gameUpdateCallback)
        this.turnOnComputer(gameId)
    }

    private turnOnComputer(gameID: string): void {
        const intervalId = setInterval(async () => {
            this.updateComputer(this.games[gameID].ball, this.games[gameID].players[1])
        }, COMPUTER_FRAME_INTERVAL)
    }

    private updateComputer(ball: BallDto, player: PlayerDto): void {
        if (ball.dx < 0) return

        const distance = Math.abs(1 - ball.x)
        const timeToReachPaddle = distance / Math.abs(ball.dx)
        const predictedBallY = ball.y + ball.dy * timeToReachPaddle

        let targetY = predictedBallY

        targetY = Math.max(
            player.paddle.height / 2,
            Math.min(1 - player.paddle.height / 2, targetY),
        )

        if (player.y < targetY) {
            player.y += Math.min(COMPUTER_SPEED, targetY - player.y)
        } else if (player.y > targetY) {
            player.y -= Math.min(COMPUTER_SPEED, player.y - targetY)
        }
    }

    // start the game loop through the logic of the game and ends in case of a win
    private startGameLoop(
        gameId: string,
        gameUpdateCallback: (gameId: string, game: gameStatusDto) => void,
    ) {
        const intervalId = setInterval(async () => {
            const game = this.games[gameId]
            this.updateGame(gameId) // game logic to be added here
            gameUpdateCallback(gameId, game)
            if (game.players[0].score >= 11 || game.players[1].score >= 11) {
                clearInterval(intervalId)
                await this.endGame(
                    game.players[0].score >= 11 ? game.players[0] : game.players[1],
                    true,
                )
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
    private checkPlayerCollision(ball: BallDto, player: PlayerDto, playerIndex: number): boolean {
        const paddleLeft = playerIndex === 0 ? player.x : player.x - player.paddle.width
        const paddleRight = playerIndex === 0 ? player.x + player.paddle.width : player.x
        const paddleTop = player.y - player.paddle.height / 2
        const paddleBottom = player.y + player.paddle.height / 2

        return (
            ball.y + ball.radius >= paddleTop &&
            ball.y - ball.radius <= paddleBottom &&
            ball.x + ball.radius >= paddleLeft &&
            ball.x - ball.radius <= paddleRight
        )
    }

    // check if the ball collided with wall or paddle and update the score if it is out of bounds
    private checkBallCollision(game: gameStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)

        // Check if the ball is within the horizontal range of the left paddle
        if (ball.x <= players[0].x + players[0].paddle.width && ball.dx < 0) {
            if (this.checkPlayerCollision(ball, players[0], 0)) {
                this.reflectBall(ball, players[0])
            } else if (ball.x < 0) {
                // Ball crossed the left boundary
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        }
        // Check if the ball is within the horizontal range of the right paddle
        else if (ball.x >= players[1].x - players[1].paddle.width && ball.dx > 0) {
            if (this.checkPlayerCollision(ball, players[1], 1)) {
                this.reflectBall(ball, players[1])
            } else if (ball.x > 1) {
                // Ball crossed the right boundary
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    public powerup(client, action: string): void {
        const player = this.players[client.id]
        if (action === 'start') {
            player.paddle.width *= 2
            player.paddle.height *= 2
        } else if (action === 'end') {
            player.paddle.width /= 2
            player.paddle.height /= 2
        }
    }

    // reflect the ball based on the paddle hit point
    private reflectBall(ball: BallDto, player: PlayerDto): void {
        ball.dx *= -1
        const relativePos = ball.y - player.y
        const paddleHitPoint = relativePos / (player.paddle.height / 2 + ball.radius)
        const angle = paddleHitPoint * REFLECT_ANGLE
        const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2)
        ball.dy = ballSpeed * Math.sin(angle * (Math.PI / 180))
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
        const game = this.games[player.gameID]
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

    private clearData(player: PlayerDto): void {
        this.players.delete(this.playersSocket[0].id)
        this.players.delete(this.playersSocket[1].id)
        this.games.delete(player.gameId)
    }

    // end the game and emit the end game event
    public async endGame(player: PlayerDto, isWinner: boolean): Promise<void> {
        if (this.isComputer(player)) return
        const opponent = this.games[player.gameId].players.find(
            (op: PlayerDto) => op.username !== player.username,
        )
        this.socketLogic.emitEndGame(isWinner ? player : opponent, this.games[player.gameId])
        const game: gameHistory = new gameHistory(this.games[player.gameId])
        game.addHistory()
        this.clearData(player)
    }

    // check if the player is a computer
    private isComputer(player: PlayerDto): boolean {
        return player.username === 'Computer'
    }
}
