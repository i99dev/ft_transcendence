import { chatType } from '@prisma/client'
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator'

export class CreateGroupChatDto {
    @IsString()
    name: string

    @IsString()
    image: string

    @IsString()
    type: chatType

    @IsOptional()
    @IsString()
    password?: string
}

export class CreateDirectChatDto {
    @IsString()
    user: string
}

export class AddMessageDto {
    @IsString()
    room_id: string

    @IsString()
    message: string
}

export class DeleteMessageDto {
    @IsString()
    room_id: string

    @IsNumber()
    message_id: number
}

export class MainInfoDto {
    @IsString()
    room_id: string

    @IsOptional()
    @IsString()
    password?: string
}

export class RoomIdDto {
    @IsString()
    room_id: string
}

export class AddUserDto {
    @IsString()
    room_id: string

    @IsString()
    user: string
}

export class SetUserDto {
    @IsString()
    room_id: string

    @IsString()
    user_login: string

    @IsString()
    action: string
}

export class UpdateChatDto {
    @IsString()
    room_id: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    image?: string

    @IsOptional()
    @IsString()
    password?: string

    @IsOptional()
    @IsString()
    type?: chatType
}
