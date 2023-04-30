import { UserStatus } from '@prisma/client'
import { PowerUp } from '../interface/game.interface'

export class UserGetDto {
    id: number
    login: string
    username: string
    email: string
    status: UserStatus
    first_name: string
    last_name: string
    created_at: Date
    last_login: Date
    image: string
    xp: number
    wr: number
    ladder: number
    two_fac_auth: boolean
    friend_to?: UserGetDto[]
    friends?: UserGetDto[]
}

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

    powerups: string []
    invitedId?: string
}

export class PowerUpInfoDto {
    type: string
    player: number
}
