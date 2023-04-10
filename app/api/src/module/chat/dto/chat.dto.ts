import { chatType } from '@prisma/client'
import { ChatUserRole, ChatUserStatus } from '@prisma/client'
export class ChatRoomDto {
    room_id: string
    name?: string
    image?: string
    type?: chatType
    password?: string
}

export class ChatUserDto {
    status?: ChatUserStatus
    user_login: string
    role?: ChatUserRole
}
