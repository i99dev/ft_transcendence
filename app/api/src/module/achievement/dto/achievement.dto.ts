import { UserStatus } from '@prisma/client'

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
    ladder: number
    xp: number
    wr: number
    two_fac_auth: boolean
}

export class AchievementDto {
    id: number
    type: string
    description?: string
    image?: string
}
