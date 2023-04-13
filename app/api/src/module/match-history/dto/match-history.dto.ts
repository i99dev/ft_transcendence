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
    xp: number
    ladder: string
    two_fac_auth: boolean
    friend_to?: UserDto[]
    friends?: UserDto[]
    player?: PlayerDto[]
}

export class PlayerDto {
    id: number
    score: number
    IsWinner: boolean
    user: UserDto
    matches?: MatchHistoryDto
}

export class MatchHistoryDto {
    gameID: string
    start: Date
    end: Date
    opponents?: PlayerDto[]
}
