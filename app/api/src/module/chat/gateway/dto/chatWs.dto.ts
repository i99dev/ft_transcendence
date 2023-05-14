import { chatType } from '@prisma/client'
import { IsString, IsEnum, IsOptional, IsNumber, IsAscii, IsNotEmpty, Length, IsUUID, Min, Matches } from 'class-validator'

export class CreateGroupChatDto {
    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string

    @IsString()
    @IsOptional()
    @Length(0, 255)
    image?: string

    @IsNotEmpty()
    @IsEnum(chatType)
    type: chatType

    @IsString()
    @IsOptional()
    @Length(0, 100)
    password?: string
}

export class CreateDirectChatDto {
    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    user: string
}

export class AddMessageDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @IsString()
    @IsNotEmpty()
    @Length(1, 1024)
    message: string
}

export class DeleteMessageDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    message_id: number
}

export class MainInfoDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @IsString()
    @IsOptional()
    @Length(0, 100)
    password?: string
}

export class RoomIdDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string
}

export class AddUserDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @Length(1, 30)
    user: string
}

export class SetUserDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^([a-z]{1,8})([-]{0,1})([a-z]{1,8})$/g)
    user_login: string

    @IsString()
    @IsNotEmpty()
    @Matches(/^([a-z]{1,15})$/g)
    action: string
}

export class UpdateChatDto {
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    room_id: string

    @IsAscii()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    @Length(1, 50)
    name?: string

    @IsString()
    @IsOptional()
    @Length(0, 255)
    image?: string

    @IsString()
    @IsOptional()
    @Length(0, 100)
    password?: string

    @IsOptional()
    @IsEnum(chatType)
    type?: chatType
}
