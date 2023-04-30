import { UserStatus } from '@prisma/client'
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator'
import { isFloat32Array } from 'util/types'

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
    ladder: number
    wr: number
    two_fac_auth: boolean
    friend_to?: UserGetDto[]
    friends?: UserGetDto[]
}

export class UserPatchDto {
    @IsOptional()
    @IsString()
    username?: string

    @IsOptional()
    @IsString()
    first_name?: string

    @IsOptional()
    @IsString()
    last_name?: string

    @IsOptional()
    @IsString()
    image?: string

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus

    @IsNumber()
    @IsOptional()
    wr?: number

    @IsOptional()
    @IsBoolean()
    two_fac_auth?: boolean
}
export class UserValidPatchDto {
    username: string
    first_name: string
    last_name: string
    image: string
    status: UserStatus
    two_fac_auth: boolean
}
