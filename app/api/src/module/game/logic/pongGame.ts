import { BallDto, PaddleDto, PlayerDto, gameStatusDto } from '../dto/game.dto'

const PADDLE_WIDTH = 0.02
const PADDLE_HEIGHT = 0.2
const PADDLE_SPEED = 0.017
const REFLECT_ANGLE = 80
const BALL_XSPEED = 0.017
const BALL_YSPEED = 0.0

export class PongGame {
    private game_status: gameStatusDto
    private game_id: string
    private gameType: string

    constructor(player1ID: string, Player2ID: string, gameType: string) {
        this.game_id = this.generateRandomId()
        this.gameType = gameType
        this.game_status = this.instanciateGame(player1ID, Player2ID)
    }

    private instanciateGame(player1ID: string, player2ID: string): gameStatusDto {
        return {
            players: [this.createPlayer(player1ID, 1), this.createPlayer(player2ID, 2)],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED,
                dy: Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED,
                radius: 0.02,
            },
        }
    }

    public getGameStatus(): gameStatusDto {
        return this.game_status
    }

    public getPlayer1ID(): string {
        return this.game_status.players[0].username
    }

    public getPlayer2ID(): string {
        return this.game_status.players[1].username
    }

    public getGameID(): string {
        return this.game_id
    }

    public getGameType(): string {
        return this.gameType
    }

    public getPlayer1Score(): number {
        return this.game_status.players[0].score
    }

    public getPlayer2Score(): number {
        return this.game_status.players[1].score
    }

    // generate a random id for the game
    private generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }

    // create a new player object
    private createPlayer(username: string, side: number): PlayerDto {
        return {
            username,
            score: 0,
            paddle: {
                x: side == 1 ? PADDLE_WIDTH / 2 : 1 - PADDLE_WIDTH / 2,
                y: 0.5,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
            },
            gameID: this.game_id,
        }
    }

    public setLoser(playerID: string): void {
        const playerIndex = this.game_status.players.findIndex(
            player => player.username === playerID,
        )

        if (playerIndex !== -1) {
            const opponentIndex = playerIndex === 0 ? 1 : 0
            this.game_status.players[opponentIndex].score = 11
        }
    }

    // update the game by updating the ball position and checking for collisions
    public updateGame(): void {
        this.updateBall()
    }

    // update the ball position and check for collisions
    private updateBall(): void {
        this.moveBall(this.game_status.ball)
        this.checkBallCollision(this.game_status)
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
    private checkPlayerCollision(ball: BallDto, paddle: PaddleDto, playerIndex: number): boolean {
        const paddleLeft = playerIndex === 0 ? paddle.x : paddle.x - paddle.width
        const paddleRight = playerIndex === 0 ? paddle.x + paddle.width : paddle.x
        const paddleTop = paddle.y - paddle.height / 2
        const paddleBottom = paddle.y + paddle.height / 2

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
        if (ball.x <= players[0].paddle.x + players[0].paddle.width && ball.dx < 0) {
            if (this.checkPlayerCollision(ball, players[0].paddle, 0)) {
                this.reflectBall(ball, players[0].paddle)
            } else if (ball.x < 0) {
                // Ball crossed the left boundary
                players[1].score += 1
                this.resetBallPosition(ball)
            }
        }
        // Check if the ball is within the horizontal range of the right paddle
        else if (ball.x >= players[1].paddle.x - players[1].paddle.width && ball.dx > 0) {
            if (this.checkPlayerCollision(ball, players[1].paddle, 1)) {
                this.reflectBall(ball, players[1].paddle)
            } else if (ball.x > 1) {
                // Ball crossed the right boundary
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    // public powerup(client, action: string): void {
    //     const player = this.players[client.id]
    //     if (
    //         (player.powerup === true && action === 'start') ||
    //         (player.powerup === false && action === 'end')
    //     )
    //         return
    //     if (action === 'start') {
    //         player.paddle.width *= 2
    //         player.paddle.height *= 2
    //         player.powerup = true
    //     } else if (action === 'end') {
    //         player.paddle.width /= 2
    //         player.paddle.height /= 2
    //         player.powerup = false
    //     }
    // }

    // reflect the ball based on the paddle hit point
    private reflectBall(ball: BallDto, paddle: PaddleDto): void {
        ball.dx *= -1
        const relativePos = ball.y - paddle.y
        const paddleHitPoint = relativePos / (paddle.height / 2 + ball.radius)
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
    public updatePaddlePosition(playerID: string, direction: string): void {
        const player = this.game_status.players.find(player => player.username === playerID)
        const game = this.game_status

        if (direction === 'up') {
            player.paddle.y -= PADDLE_SPEED
        } else if (direction === 'down') {
            player.paddle.y += PADDLE_SPEED
        }

        player.paddle.y = Math.max(
            0 + player.paddle.height / 2,
            Math.min(1 - player.paddle.height / 2, player.paddle.y),
        )
    }
}
