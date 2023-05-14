import { UserStatus } from '@prisma/client'
import { PowerUp } from '../interface/game.interface'

export class gameStatusDto {
    players: PlayerDto[]
    ball: BallDto
}

export class SetupDto {
    game: gameStatusDto
    player: number
}

export class BallDto {
    x: number
    y: number
    dx: number
    dy: number
    radius: number
    color: string
}

export class PlayerDto {
    username: string
    score: number
    paddle: PaddleDto
    gameID?: string
    powerUps: PowerUp[]
}

export class PaddleDto {
    x: number
    y: number
    width: number
    height: number
    speed: number
    color: string
}

export class GameSelectDto {
    gameType: 'classic' | 'custom'

    gameMode: 'single' | 'multi'

    powerups: string[]
    invitedId?: string
}

export class PowerUpInfoDto {
    type: string
    player: number
}
