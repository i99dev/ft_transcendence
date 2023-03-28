/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   gameLogic.ts                                       :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: aaljaber <aaljaber@student.42abudhabi.a    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2023/03/25 08:07:46 by aaljaber          #+#    #+#             */
/*   Updated: 2023/03/28 06:11:43 by aaljaber         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { gameStatusDto, PlayerDto, BallDto } from '../dto/game.dto'
import { Socket } from 'socket.io'
import { gameHistory } from './gameHistory'
import { socketLogic } from './gameSocket'

const FRAMES_PER_SECOND = 60
const FRAME_INTERVAL = 1000 / FRAMES_PER_SECOND
const PADDLE_SPEED = 0.025
const REFLECT_ANGLE = 80
const BALL_XSPEED = 0.005
const BALL_YSPEED = 0.0
export class gameLogic {
    private players: Map<string, PlayerDto> = new Map()
    private games: Map<string, gameStatusDto> = new Map()
    private gameHistory = new gameHistory()
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
    private checkPlayerCollision(ball: BallDto, player: PlayerDto): boolean {
        if (
            ball.y >= player.y - player.paddle.height / 2 - ball.radius &&
            ball.y <= player.y + player.paddle.height / 2 + ball.radius
        ) {
            return true
        }
        return false
    }

    // check if the ball collided with wall or paddle and update the score if it is out of bounds
    private checkBallCollision(game: gameStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)

        // more accurate check can be applied here by checking if there is a an overlap between the ball and the paddle.
        if (ball.x <= ball.radius + players[0].paddle.width) {
            if (this.checkPlayerCollision(ball, players[0])) {
                this.reflectBall(ball, players[0])
            } else {
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        } else if (ball.x >= 1 - (ball.radius + players[0].paddle.width)) {
            if (this.checkPlayerCollision(ball, players[1])) {
                this.reflectBall(ball, players[1])
            } else {
                players[0].score += 1
                this.resetBallPosition(ball)
            }
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

    public async endGame(player: PlayerDto, isWinner: boolean): Promise<void> {
        const opponent = this.games[player.gameId].players.find(
            (op: PlayerDto) => op.username !== player.username,
        )
        this.socketLogic.emitEndGame(
            this.playersSocket,
            isWinner ? player : opponent,
            this.games[player.gameId],
        )
        // await this.gameHistory.addHistory(this.games[player.gameId])
        this.clearData(player)
    }
}
