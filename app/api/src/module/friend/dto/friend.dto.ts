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
    total_wins: number
    total_loses: number
    exp_level: number
    points: number
    two_fac_auth: boolean
    friend_to?: UserGetDto[]
    friends?: UserGetDto[]
}