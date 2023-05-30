import {
    IsArray,
    IsAscii,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Length,
    Min,
} from 'class-validator'
import { PowerUp } from '../interface/game.interface'

export class gameStatusDto {
    players: PlayerDto[]
    ball: BallDto
    time: number
    countDown: number
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
    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    login: string

    @Min(0)
    @IsNumber()
    score: number

    paddle: PaddleDto

    @IsUUID()
    @IsNotEmpty()
    @IsOptional()
    gameID?: string

    powerUps: PowerUp[]
    ready: boolean
}

export class PaddleDto {
    @IsNumber()
    @IsNotEmpty()
    x: number

    @IsNumber()
    @IsNotEmpty()
    y: number

    @IsNumber()
    @IsNotEmpty()
    width: number

    @IsNumber()
    @IsNotEmpty()
    height: number

    @IsNumber()
    @IsNotEmpty()
    speed: number

    @IsString()
    @Length(0, 100)
    color: string
}

enum gameType {
    classic = 'classic',
    custom = 'custom',
}

enum gameMode {
    single = 'single',
    multi = 'multi',
}

export class GameSelectDto {
    @IsNotEmpty()
    @IsEnum(gameType)
    gameType: gameType

    @IsNotEmpty()
    @IsEnum(gameMode)
    gameMode: gameMode

    @IsArray()
    @IsString({ each: true })
    @Length(1, 100, { each: true })
    powerups: string[]

    @IsString()
    @IsOptional()
    @Length(0, 100)
    invitedId?: string
}

export class PowerUpInfoDto {
    type: string
    player: number
}

export class InviteDto {
    @IsString()
    inviterId: string

    @IsString()
    invitedId: string

    @IsNotEmpty()
    @IsEnum(gameType)
    gameType: gameType

    powerups: string[]

    @IsOptional()
    @IsBoolean()
    accepted?: boolean
}
