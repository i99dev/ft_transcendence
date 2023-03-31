import { IsString, IsEnum, IsOptional, IsBoolean, IsNumber } from 'class-validator'

export class AddMessageDto {
  // info: chatMainInfo
  @IsString()
  sender: string

  @IsString()
  reciever: string

  @IsString()
  message: string
}

export class DeleteMessageDto {
  // info: chatMainInfo
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
