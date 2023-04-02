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
    constructor(private readonly chatService: ChatService) {}

    @Get('/:room_id')
    async getRoom(@Param('room_id') room_id: string) {
        return await this.chatService.getRoom(room_id)
    }

    @Get('/:room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string) {
        const room = await this.chatService.getRoom(room_id);
        if (room.type === ChatRoomType.DM)
            return await this.chatService.getDirectChatUsers(room_id);
        else
            return await this.chatService.getGroupChatUsers(room_id);
    }

    @Get('/:room_id/messages')
    async getRoomMessages(@Param('room_id') room_id: string) {
        return await this.chatService.getChatRoomMessages(room_id);
    }

    @Get('/:room_id/messages/:user')
    async getRoomMessagesByUser(@Param('room_id') room_id: string, @Param('user') user: string) {
        return await this.chatService.getChatUserMessages(room_id, user);
    }

}
