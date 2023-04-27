import { ChatUserRole, ChatUserStatus } from '@prisma/client'

export interface UpdateChatUserInterface {
    status?: ChatUserStatus
    role?: ChatUserRole
}
