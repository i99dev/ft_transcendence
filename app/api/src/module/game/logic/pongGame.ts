import { BallDto, PaddleDto, PlayerDto, PowerUpInfoDto, gameStatusDto } from '../dto/game.dto'
import { PowerUp } from '../interface/game.interface';


const DEFAULT_POWER_UPS: PowerUp[] = [
    {
        type: 'Hiken',
        active: false,
        duration: 0,
    },
    {
        type: 'Baika no Jutsu',
        active: false,
        duration: 5000,
    },
    {
        type: 'Shinigami',
        active: false,
        duration: 500,
    },
    {
        type: 'Shunshin no Jutsu',
        active: false,
        duration: 10000,
    },
];

const PADDLE_WIDTH = 0.02
const PADDLE_HEIGHT = 0.2
const PADDLE_SPEED = 0.019
const REFLECT_ANGLE = 80
const BALL_XSPEED = 0.017
const BALL_YSPEED = 0.0
const COMPUTER_SPEED = 0.0075

export class PongGame {
    private game_status: gameStatusDto
    private game_id: string
    private gameType: string
    // private powerUpEventCallback?: (eventName: string, data: PowerUpInfoDto) => void;

    constructor(player1ID: string, Player2ID: string, gameType: string/* , powerUpEventCallback?: (eventName: string, data: PowerUpInfoDto) => void */) {
        this.game_id = this.generateRandomId()
        this.gameType = gameType
        this.game_status = this.instanciateGame(player1ID, Player2ID)
        // if(gameType == 'custom') {
        //     this.powerUpEventCallback = powerUpEventCallback
        // }
    }

    private instanciateGame(player1ID: string, player2ID: string): gameStatusDto {
        return {
            players: [this.createPlayer(player1ID, 1), this.createPlayer(player2ID, 2)],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED,
                dy: Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED,
                radius: 0.015,
                color: 'white',
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

    // generate a random id for the game.. replace with uuid later
    private generateRandomId(): string {
        return Math.random().toString(36) + Date.now().toString(36)
    }

    private createPlayer(username: string, side: number): PlayerDto {
        return {
            username,
            score: 0,
            paddle: {
                x: side == 1 ? PADDLE_WIDTH / 2 : 1 - PADDLE_WIDTH / 2,
                y: 0.5,
                width: PADDLE_WIDTH,
                height: PADDLE_HEIGHT,
                speed: PADDLE_SPEED,
                color: 'white',
            },
            gameID: this.game_id,
            powerUps: [
                {
                    type: 'Hiken',
                    active: false,
                    duration: 0,
                },
                {
                    type: 'Baika no Jutsu',
                    active: false,
                    duration: 5000,
                },
                {
                    type: 'Shinigami',
                    active: false,
                    duration: 500,
                },
                {
                    type: 'Shunshin no Jutsu',
                    active: false,
                    duration: 10000,
                },
            ]
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

    public updateComputer(): void {
        const computer = this.game_status.players.find(player => player.username === 'Computer')
        const ball = this.game_status.ball
        const paddle = computer.paddle
        if (computer) {

            if (ball.dx < 0) return

            const distance = Math.abs(1 - ball.x)
            const timeToReachPaddle = distance / Math.abs(ball.dx)
            const predictedBallY = ball.y + ball.dy * timeToReachPaddle

            let targetY = predictedBallY

            targetY = Math.max(paddle.height / 2, Math.min(1 - paddle.height / 2, targetY))

            if (paddle.y < targetY) {
                paddle.y += Math.min(COMPUTER_SPEED, targetY - paddle.y)
            } else if (paddle.y > targetY) {
                paddle.y -= Math.min(COMPUTER_SPEED, paddle.y - targetY)
            }
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
        if ((ball.y <= ball.radius && ball.dy < 0) || (ball.y >= 1 - ball.radius && ball.dy > 0)) {
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

    private handleShinigamiPowerUp(game: gameStatusDto, playerIndex: number): void {
        const player = game.players[playerIndex]
        const powerUp = player.powerUps.find(powerUp => powerUp.type === 'Shinigami')


        if (powerUp && powerUp.active) {
            game.ball.color = 'transparent'
            this.disablePowerUp(player, powerUp)
        }
        else
            game.ball.color = 'white'

    }

    private handleHikenPowerUp(game: gameStatusDto, playerIndex: number): void {
        const player = game.players[playerIndex]
        const powerUp = player.powerUps.find(powerUp => powerUp.type === 'Hiken')

        if (powerUp && powerUp.active) {
            game.ball.color = 'blue'
            console.log('Hikennnnnnnnnnn')
            game.ball.color = 'red'
            game.ball.dx *= 2
            game.ball.dy *= 2
            this.disablePowerUp(player, powerUp)
        }
        else {
            game.ball.color = 'white'
            const originalSpeed = Math.sqrt(BALL_XSPEED ** 2 + BALL_YSPEED ** 2);
            const currentSpeed = Math.sqrt(game.ball.dx ** 2 + game.ball.dy ** 2);

            game.ball.dx = (game.ball.dx / currentSpeed) * originalSpeed;
            game.ball.dy = (game.ball.dy / currentSpeed) * originalSpeed;
        }

    }
    // check if the ball collided with wall or paddle and update the score if it is out of bounds
    private checkBallCollision(game: gameStatusDto): void {
        const { ball, players } = game

        this.checkWallCollision(ball)

        // Check if the ball is within the horizontal range of the left paddle
        if (ball.x <= players[0].paddle.x + players[0].paddle.width && ball.dx < 0) {
            if (this.checkPlayerCollision(ball, players[0].paddle, 0)) {
                this.reflectBall(ball, players[0].paddle)
                this.handleHikenPowerUp(game, 0)
                this.handleShinigamiPowerUp(game, 0)
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
                this.handleHikenPowerUp(game, 1)
                this.handleShinigamiPowerUp(game, 1)
            } else if (ball.x > 1) {
                // Ball crossed the right boundary
                players[0].score += 1
                this.resetBallPosition(ball)
            }
        }
    }

    public activatePowerUp(playerID: string, type: string): void {
        const player = this.game_status.players.find(player => player.username === playerID)
        const powerUp = player.powerUps.find(powerUp => powerUp.type === type)

        if (powerUp && !powerUp.active) {
            powerUp.active = true

            if (powerUp.type == 'Baika no Jutsu') {
                player.paddle.height *= 2;
                setTimeout(() => {
                    this.disablePowerUp(player, powerUp)
                }, powerUp.duration);
            }
            else if (powerUp.type == 'Hiken') {
                console.log("Hiken activated")
                player.paddle.color = 'orange'
            }
            else if (powerUp.type == 'Shinigami') {
                console.log("Shinigami activated")
            }
            else if (powerUp.type == 'Shunshin no Jutsu') {
                console.log("Shunshin activated")
                player.paddle.speed *= 1.5;
                player.paddle.color = 'cyan'
                setTimeout(() => {
                    this.disablePowerUp(player, powerUp)
                }, powerUp.duration);

            }


        }
    }

    private disablePowerUp(player: PlayerDto, powerUp: PowerUp): void {

        powerUp.active = false
        if (powerUp.type == 'Hiken') {
            player.paddle.color = 'white';
        }
        else if (powerUp.type == 'Baika no Jutsu') {
            player.paddle.height = PADDLE_HEIGHT;
        }
        else if (powerUp.type == 'Shinigami') {

            setTimeout(() => {
                this.game_status.ball.color = 'white';
            }, powerUp.duration);
        }
        else if (powerUp.type == 'Shunshin no Jutsu') {
            player.paddle.speed = PADDLE_SPEED;
            player.paddle.color = 'white';
        }

    }

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
            player.paddle.y -= player.paddle.speed
        } else if (direction === 'down') {
            player.paddle.y += player.paddle.speed
        }

        player.paddle.y = Math.max(
            0 + player.paddle.height / 2,
            Math.min(1 - player.paddle.height / 2, player.paddle.y),
        )
    }
}
