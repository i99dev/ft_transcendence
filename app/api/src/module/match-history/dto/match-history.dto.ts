import { UserStatus } from '@prisma/client'

export class UserDto {
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
    exp_level: number
    points: number
    two_fac_auth: boolean
    friend_to?: UserDto[]
    friends?: UserDto[]
}

export class PlayerDto {
    id: number
    score: number
    IsWinner: boolean
    user: UserDto
    matche: MatchHistoryDto
}

export class MatchHistoryDto {
    gameID: string
    start: Date
    end: Date
    opponents: PlayerDto[]
}
