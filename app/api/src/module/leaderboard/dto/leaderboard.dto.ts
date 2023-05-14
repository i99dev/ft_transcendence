import { UserGetDto } from '@module/user/dto/user.dto'
import { UserStatus } from '@prisma/client'

export class PlayerDto {
    id: number
    score: number
    IsWinner: boolean
    user: UserGetDto
    matches?: MatchHistoryDto
}

export class MatchHistoryDto {
    gameID: string
    start: Date
    end: Date
    opponents?: PlayerDto[]
}
