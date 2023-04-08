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

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getChatRooms(@Query('type') type: string, @Req() req) {
        if (!type)
            return await this.groupService.getChatRooms()
        else if (type === 'GROUP')
            return await this.groupService.getChatRoomsForGroups()
        else if (type === 'DM')
            return await this.chatService.getDirectChatRooms()
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id')
    async getRoom(@Param('room_id') room_id: string, @Req() req) {
        return await this.groupService.getChatRoom(room_id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string, @Req() req) {
        const room = await this.groupService.getChatRoom(room_id)
        if (room.type === ChatRoomType.DM) return await this.chatService.getDirectChatUsers(room_id)
        else return await this.groupService.getGroupChatUsers(room_id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/messages')
    async getRoomMessages(@Param('room_id') room_id: string, @Req() req) {
        return await this.groupService.getChatRoomMessages(room_id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/messages/me')
    async getRoomMessagesByUser(
        @Param('room_id') room_id: string,
        @Req() req,
    ) {
        return await this.chatService.getChatUserMessagesInChatRoom(room_id, req.user.login)
    }
}
