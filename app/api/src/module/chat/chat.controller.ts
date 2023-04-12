import { GroupChatService } from './groupChat.service'
import { Get, Param, Query } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ChatRoomType } from '@prisma/client'
@Controller('/chats')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly groupChatService: GroupChatService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getChatRooms(@Query('type') type: string, @Req() req) {
        if (!type) return await this.groupChatService.getChatRooms()
        else if (type === 'GROUP') return await this.groupChatService.getChatRoomsForGroups(req.user.login)
        else if (type === 'DM') return await this.chatService.getDirectChatRooms(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id')
    async getRoom(@Param('room_id') room_id: string, @Req() req) {
        return await this.groupChatService.getChatRoom(room_id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/users')
    async getRoomUsers(@Param('room_id') room_id: string, @Req() req) {
        const room = await this.groupChatService.getChatRoom(room_id)
        if (room.type === ChatRoomType.DM) return await this.chatService.getDirectChatUsers(room_id)
        else return await this.groupChatService.getGroupChatUsers(room_id)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/messages')
    async getRoomMessages(
        @Param('room_id') room_id: string,
        @Req() req,
        @Query('page') page: number,
    ) {
        if (page <= 0 || page > 1000000) return []
        if (page <= 0) return []
        return await this.groupChatService.getChatRoomMessages(room_id, page)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:room_id/messages/me')
    async getRoomMessagesByUser(@Param('room_id') room_id: string, @Req() req) {
        return await this.chatService.getChatUserMessagesInChatRoom(room_id, req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/groupChat/me')
    async getGroupChat(@Req() req) {
        return await this.groupChatService.getGroupChatForUser(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/directChat/me')
    async getDirectChat(@Req() req) {
        return await this.chatService.getDirectChatForUser(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/groupChat/search')
    async searchGroupChat(@Req() req, @Query('name') search: string, @Query('page') page: number) {
        if (page <= 0) return []
        if (!search) return await this.groupChatService.getAllGroupChats(page)
        return await this.groupChatService.searchGroupChat(search)
    }
}
