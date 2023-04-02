import { GroupService } from './group.service';
import { Patch, Post, UsePipes, Get, Param } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { ChatPostValidation, UserPostValidation } from './pipe/chat.pipe'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ChatRoomDto, ChatUserDto } from './dto/chat.dto'
import { ChatRoomType } from '@prisma/client'
@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly groupService: GroupService) {}

    @Get('/:room_id')
    async getRoom(@Param('room_id') room_id: string) {
        return await this.groupService.getRoom(room_id)
    }

    @Get('/rooms')
    async getChatRooms() {
        return await this.groupService.getChatRooms()
    }

    @Get('/rooms/:type')
    async getChatRoomsByType(@Param('type') type: string) {
        if (type === 'GROUP')
            return await this.groupService.getGroupChatRooms()
        else if (type === 'DM')
            return await this.groupService.getDirectChatRooms()
    }

    @Get('/:room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string) {
        const room = await this.groupService.getRoom(room_id);
        if (room.type === ChatRoomType.DM)
            return await this.chatService.getDirectChatUsers(room_id);
        else
            return await this.groupService.getGroupChatUsers(room_id);
    }

    @Get('/:room_id/messages')
    async getRoomMessages(@Param('room_id') room_id: string) {
        return await this.groupService.getChatRoomMessages(room_id);
    }

    @Get('/:room_id/messages/:user')
    async getRoomMessagesByUser(@Param('room_id') room_id: string, @Param('user') user: string) {
        return await this.chatService.getChatUserMessagesInChatRoom(room_id, user);
    }

    @Get('/messages/:user')
    async getMessagesByUser(@Param('room_id') room_id: string, @Param('user') user: string) {
        return await this.chatService.getChatUserMessages(user);
    }

}
