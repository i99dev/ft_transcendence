import { UserStatus } from '@prisma/client'

export interface NewUser {
    login: string
    username: string
    first_name: string
    last_name: string
    image: string
    email: string
    status: UserStatus
    xp: number
    ladder: string
}
