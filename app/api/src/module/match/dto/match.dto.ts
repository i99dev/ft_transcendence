import { UserGetDto } from '@module/user/dto/user.dto'

export class PlayerDto {
    id: number
    score: number
    IsWinner: boolean
    user?: UserGetDto
    matches?: MatchDto
}

export class MatchDto {
    gameID: string
    start: Date
    end: Date
    opponents?: PlayerDto[]
}
