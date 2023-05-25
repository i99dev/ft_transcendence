import { Injectable } from '@nestjs/common'
import { BallDto, PaddleDto, PlayerDto, gameStatusDto } from '../dto/game.dto'
import { PowerUp } from '../interface/game.interface'
import { EventEmitter } from 'events'
import { Player } from '@prisma/client'

const DEFAULT_POWER_UPS: PowerUp[] = [
    {
        type: 'Hiken',
        active: false,
        ready: true,
        duration: 0,
        cooldown: 7000,
    },
    {
        type: 'Baika no Jutsu',
        active: false,
        ready: true,
        duration: 5000,
        cooldown: 7000,
    },
    {
        type: 'Shinigami',
        active: false,
        ready: true,
        duration: 500,
        cooldown: 8000,
    },
    {
        type: 'Shunshin no Jutsu',
        active: false,
        ready: true,
        duration: 10000,
        cooldown: 8000,
    },
]

const PADDLE_WIDTH = 0.02
const PADDLE_HEIGHT = 0.2
const PADDLE_SPEED = 0.0175
const REFLECT_ANGLE = 80
const BALL_XSPEED = 0.017
const BALL_YSPEED = 0.0
const COMPUTER_SPEED = 0.0075

interface gameAnalyzer {
    BlockingShot: number
    TableHit: number
    EdgeHit: number
    Achievements: string[]
}

@Injectable()
export class PongGame {
    private game_status: gameStatusDto
    private game_id: string
    private gameType: string
    private winner: string
    public events: EventEmitter
    public analyzePlayer = new Map<string, gameAnalyzer>()
    constructor(
        player1Login: string,
        Player2Login: string,
        gameType: string,
        p1PowerUps?: string[],
        p2PowerUps?: string[],
    ) {
        this.game_id = this.generateRandomId()
        this.gameType = gameType
        this.events = new EventEmitter()
        this.winner = null
        if (gameType == 'classic')
            this.game_status = this.instanciateGame(player1Login, Player2Login)
        else
            this.game_status = this.instanciateGame(
                player1Login,
                Player2Login,
                p1PowerUps,
                p2PowerUps,
            )
        this.createPlayerAnalyzer(player1Login)
        this.createPlayerAnalyzer(Player2Login)
    }

    private createPlayerAnalyzer(playerLogin: string): void {
        this.analyzePlayer.set(playerLogin, {
            BlockingShot: 0,
            TableHit: 0,
            EdgeHit: 0,
            Achievements: [],
        })
    }

    private instanciateGame(
        player1Login: string,
        Player2Login: string,
        p1PowerUps?: string[],
        p2PowerUps?: string[],
    ): gameStatusDto {
        return {
            players: [
                this.createPlayer(player1Login, 1, p1PowerUps),
                this.createPlayer(Player2Login, 2, p2PowerUps),
            ],
            ball: {
                x: 0.5,
                y: 0.5,
                dx: Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED,
                dy: Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED,
                radius: 0.015,
                color: 'white',
            },
            time: 120,
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
        return crypto.randomUUID()
    }

    private createPlayer(username: string, side: number, pickedPowerUps: string[]): PlayerDto {
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
            powerUps: this.createPowerUps(pickedPowerUps),
            ready: username == 'Computer' ? true : false
        }
    }

    private createPowerUps(pickedPowerUps: string[]): PowerUp[] {
        if (this.gameType == 'classic' || !pickedPowerUps) return []

        const powerUps: PowerUp[] = DEFAULT_POWER_UPS.filter(powerUp =>
            pickedPowerUps.includes(powerUp.type),
        ).map(powerUp => JSON.parse(JSON.stringify(powerUp)))

        return powerUps
    }

    public setPlayerReady(playerLogin: string): void {
        const player = this.game_status.players.find(player => player.username === playerLogin)
        if (player) player.ready = true
    }

    public isPlayersReady(playerLogin?: string): boolean {
        if (playerLogin) {
            const player = this.game_status.players.find(player => player.username === playerLogin)
            if (player) return player.ready
        }
        const players = this.game_status.players
        return players[0].ready && players[1].ready
    }

    // public setLoser(playerID: string): void {
    //     const playerIndex = this.game_status.players.findIndex(
    //         player => player.username === playerID,
    //     )

    //     if (playerIndex !== -1) {
    //         const opponentIndex = playerIndex === 0 ? 1 : 0
    //         this.game_status.players[opponentIndex].score = 11
    //     }
    // }

    public setWinner(playerID: string): void {
        const playerIndex = this.game_status.players.findIndex(
            player => player.username === playerID,
        )
        if (playerIndex !== -1) {
            this.winner = this.game_status.players[playerIndex].username
        }
    }

    public setLoser(playerID: string): void {
        const playerIndex = this.game_status.players.findIndex(
            player => player.username === playerID,
        )

        if (playerIndex !== -1) {
            const opponentIndex = playerIndex === 0 ? 1 : 0
            this.winner = this.game_status.players[opponentIndex].username
        }
    }

    public checkWinner(): boolean {
        if (this.winner) return true
        const player1Score = this.game_status.players[0].score
        const player2Score = this.game_status.players[1].score
        if (player1Score === 11) {
            this.winner = this.game_status.players[0].username
            return true
        }
        if (player2Score === 11) {
            this.winner = this.game_status.players[1].username
            return true
        }
        return false
    }

    public getWinner(): PlayerDto {
        return this.game_status.players.find(player => player.username === this.winner)
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
        this.updateTimer()
        if (this.getPlayer2ID() === 'Computer') this.updateComputer()
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
            this.events.emit('play-sound', 'ball-hit')
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
                this.analyzePlayer.get(players[0].username).BlockingShot += 1
                this.reflectBall(ball, players[0].paddle)
                this.handleHikenPowerUp(game, 0)
                this.handleShinigamiPowerUp(game, 0)
            } else if (ball.x < 0) {
                // Ball crossed the left boundary
                players[1].score += 1
                this.grantBallWhispererAchievement(ball, players[1])
                this.grantPaddleSamuraiAchievement(players[0])
                this.resetBallPosition(ball)
            }
        }
        // Check if the ball is within the horizontal range of the right paddle
        else if (ball.x >= players[1].paddle.x - players[1].paddle.width && ball.dx > 0) {
            if (this.checkPlayerCollision(ball, players[1].paddle, 1)) {
                this.analyzePlayer.get(players[1].username).BlockingShot += 1
                this.reflectBall(ball, players[1].paddle)
                this.handleHikenPowerUp(game, 1)
                this.handleShinigamiPowerUp(game, 1)
            } else if (ball.x > 1) {
                // Ball crossed the right boundary
                players[0].score += 1
                this.grantBallWhispererAchievement(ball, players[0])
                this.grantPaddleSamuraiAchievement(players[1])
                this.resetBallPosition(ball)
            }
        }
    }

    private grantBallWhispererAchievement(ball: BallDto, player: PlayerDto): void {
        if (ball.y > 1 && ball.y < 0) {
            this.analyzePlayer.get(player.username).EdgeHit += 1
            this.analyzePlayer.get(player.username).EdgeHit = 0
        }
        if (
            this.analyzePlayer.get(player.username).EdgeHit > 3 &&
            this.analyzePlayer.get(player.username).Achievements.indexOf('Ball Whisperer') === -1
        ) {
            this.analyzePlayer.get(player.username).Achievements.push('Ball Whisperer')
        }
    }

    // grant paddle sumaurai achievement if the player blocked 5 shots in a row
    private grantPaddleSamuraiAchievement(player: PlayerDto): void {
        if (this.analyzePlayer.get(player.username).BlockingShot > 5) {
            if (
                this.analyzePlayer.get(player.username).Achievements.indexOf('Paddle Samurai') ===
                -1
            ) {
                this.analyzePlayer.get(player.username).Achievements.push('Paddle Samurai')
            }
        }
        this.analyzePlayer.get(player.username).BlockingShot = 0
    }

    // reflect the ball based on the paddle hit point
    private reflectBall(ball: BallDto, paddle: PaddleDto): void {
        ball.dx *= -1
        const relativePos = ball.y - paddle.y
        const paddleHitPoint = relativePos / (paddle.height / 2 + ball.radius)
        const angle = paddleHitPoint * REFLECT_ANGLE
        const ballSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2)
        ball.dy = ballSpeed * Math.sin(angle * (Math.PI / 180))
        this.events.emit('play-sound', 'ball-hit')
    }
    // reset the ball position to the center
    private resetBallPosition(ball: BallDto): void {
        ball.x = 0.5
        ball.y = 0.5
        ball.dx = 0
        if (this.gameType == 'custom') {
            ball.dy = Math.random() * 0.02 - 0.01
        } else {
            ball.dy = 0
        }
        setTimeout(() => {
            ball.dx = Math.random() > 0.5 ? BALL_XSPEED : -BALL_XSPEED
            ball.dy = Math.random() > 0.5 ? BALL_YSPEED : -BALL_YSPEED
        }, 1500)
    }

    // update the paddle position of the player based on the direction
    public updatePaddlePosition(playerID: string, direction: string): void {
        const player = this.game_status.players.find(player => player.username === playerID)

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

    // ! POWER UPS ! //
    private handleShinigamiPowerUp(game: gameStatusDto, playerIndex: number): void {
        const player = game.players[playerIndex]
        const powerUp = player.powerUps.find(powerUp => powerUp.type === 'Shinigami')

        if (powerUp && powerUp.active) {
            game.ball.color = 'transparent'
            this.disablePowerUp(player, powerUp)
        } else game.ball.color = 'white'
    }

    private handleHikenPowerUp(game: gameStatusDto, playerIndex: number): void {
        const player = game.players[playerIndex]
        const powerUp = player.powerUps.find(powerUp => powerUp.type === 'Hiken')

        if (powerUp && powerUp.active) {
            game.ball.color = 'red'
            game.ball.dx *= 2
            game.ball.dy *= 2
            this.disablePowerUp(player, powerUp)
        } else {
            game.ball.color = 'white'
            const originalSpeed = Math.sqrt(BALL_XSPEED ** 2 + BALL_YSPEED ** 2)
            const currentSpeed = Math.sqrt(game.ball.dx ** 2 + game.ball.dy ** 2)

            game.ball.dx = (game.ball.dx / currentSpeed) * originalSpeed
            game.ball.dy = (game.ball.dy / currentSpeed) * originalSpeed
        }
    }

    public activatePowerUp(playerID: string, powerUpNo: number): void {
        const player = this.game_status.players.find(player => player.username === playerID)

        // if any power up is active, don't activate another one
        if (player.powerUps.some(powerUp => powerUp.active)) return
        const powerUp = player.powerUps[powerUpNo - 1]
        if (powerUp && powerUp.ready === true) {
            powerUp.active = true
            powerUp.ready = false

            if (powerUp.type == 'Baika no Jutsu') {
                player.paddle.height *= 2
                setTimeout(() => {
                    this.disablePowerUp(player, powerUp)
                }, powerUp.duration)
            } else if (powerUp.type == 'Hiken') {
                player.paddle.color = 'orange'
            } else if (powerUp.type == 'Shinigami') {
            } else if (powerUp.type == 'Shunshin no Jutsu') {
                player.paddle.speed *= 1.5
                player.paddle.color = 'cyan'
                setTimeout(() => {
                    this.disablePowerUp(player, powerUp)
                }, powerUp.duration)
            }
        }
    }

    public updateTimer(): void {
        if (this.game_status.time > 0) {
            this.game_status.time -= 1 / 60
        } else {
            this.game_status.time = 0
        }
    }

    private disablePowerUp(player: PlayerDto, powerUp: PowerUp): void {
        powerUp.active = false
        if (powerUp.type == 'Hiken') {
            player.paddle.color = 'white'
        } else if (powerUp.type == 'Baika no Jutsu') {
            player.paddle.height = PADDLE_HEIGHT
        } else if (powerUp.type == 'Shinigami') {
            setTimeout(() => {
                this.game_status.ball.color = 'white'
            }, powerUp.duration)
        } else if (powerUp.type == 'Shunshin no Jutsu') {
            player.paddle.speed = PADDLE_SPEED
            player.paddle.color = 'white'
        }
        setTimeout(() => {
            powerUp.ready = true
        }, powerUp.cooldown)
    }
}
