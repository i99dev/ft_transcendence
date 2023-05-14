import { NotificationType } from '@prisma/client'
import { IsOptional, IsString } from 'class-validator'

export class CreateNotificationDto {
    @IsString()
    user_login: string

    @IsString()
    content: string

    @IsString()
    type: NotificationType

    @IsString()
    @IsOptional()
    target?: string
}
