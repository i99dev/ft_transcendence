import { UserStatus } from '@prisma/client'
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber, IsNotEmpty, Min, Matches, IsAscii, Length, IsEmail } from 'class-validator'

export class UserGetDto {
    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    id: number

    @IsString()
    @IsNotEmpty()
    @Matches(/^([a-z]{1,8})([-]{0,1})([a-z]{1,8})$/g)
    login: string

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    username: string

    @IsAscii()
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    email: string

    @IsNotEmpty()
    @IsEnum(UserStatus)
    status: UserStatus

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    first_name: string

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    last_name: string

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    created_at: Date

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    last_login: Date

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    image: string

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    xp: number

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    ladder: number

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    wr: number

    @IsBoolean()
    @IsNotEmpty()
    two_fac_auth: boolean

    @IsOptional()
    friend_to?: UserGetDto[]

    @IsOptional()
    friends?: UserGetDto[]
}

export class UserPatchDto {
    @IsAscii()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 30)
    username?: string

    @IsAscii()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 50)
    first_name?: string

    @IsAscii()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 50)
    last_name?: string

    @IsAscii()
    @IsString()
    @IsOptional()
    @IsNotEmpty()
    @Length(1, 255)
    image?: string

    @IsOptional()
    @IsEnum(UserStatus)
    status?: UserStatus

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    @IsOptional()
    wr?: number

    @IsBoolean()
    @IsOptional()
    two_fac_auth?: boolean
}