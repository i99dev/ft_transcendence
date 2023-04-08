import { GroupService } from './groupChat.service'
import { Patch, Post, UsePipes, Get, Param, Query } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { ChatPostValidation, UserPostValidation } from './pipe/chat.pipe'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { ChatRoomType } from '@prisma/client'
@Controller('/chats')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly groupService: GroupService,
    ) {}

    @Get('')
    async getChatRooms(@Query('type') type: string) {
        if (!type)
            return await this.groupService.getChatRooms()
        else if (type === 'GROUP')
            return await this.groupService.getChatRoomsForGroups()
        else if (type === 'DM')
            return await this.chatService.getDirectChatRooms()
    }

    @Get('/:room_id')
    async getRoom(@Param('room_id') room_id: string) {
        return await this.groupService.getChatRoom(room_id);
    }

    @Get('/:room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string) {
        const room = await this.groupService.getChatRoom(room_id)
        if (room.type === ChatRoomType.DM) return await this.chatService.getDirectChatUsers(room_id)
        else return await this.groupService.getGroupChatUsers(room_id)
    }

    @Get('/:room_id/messages')
    async getRoomMessages(@Param('room_id') room_id: string) {
        return await this.groupService.getChatRoomMessages(room_id)
    }

    @Get('/:room_id/messages/:user_id')
    async getRoomMessagesByUser(
        @Param('room_id') room_id: string,
        @Param('user_id') user_id: string,
    ) {
        const user = parseInt(user_id)
        return await this.chatService.getChatUserMessagesInChatRoom(room_id, user)
    }
}
