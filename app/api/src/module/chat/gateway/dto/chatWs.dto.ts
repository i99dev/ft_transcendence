import { chatType } from '@prisma/client'
import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator'

export class CreateGroupChatDto {
    @IsString()
    sender: string

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

export class AddMessageDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsString()
    message: string
}

export class DeleteMessageDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsNumber()
    message_id: number
}

export class MainInfoDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsString()
    password?: string
}

export class AddUserDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsString()
    user: string
}

export class SetUserDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsString()
    user: string

    @IsString()
    action: string
}

export class UpdateChatDto {
    @IsString()
    sender: string

    @IsString()
    reciever: string

    @IsOptional()
    @IsString()
    name?: string

    @IsOptional()
    @IsString()
    image?: string
}