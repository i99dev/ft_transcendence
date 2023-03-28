import { chatType } from '@prisma/client'
export class ChatRoomDto {
    room_id: string
    name?: string
    image?: string
    type?: chatType
    password?: string
}

export class ChatUserDto {
    status?: string
    user_login: string
}
