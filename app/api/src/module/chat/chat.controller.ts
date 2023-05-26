import { GroupChatService } from './groupChat.service'
import {
    BadRequestException,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Query,
} from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ChatRoomType, ChatUserStatus } from '@prisma/client'
import { DirectChatService } from './directChat.service'
import { ParseStringPipe } from '@common/pipes/string.pipe'
import { PosNumberPipe } from '@common/pipes/posNumber.pipe'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'
@UseGuards(JwtAuthGuard)
@Controller('/chats')
export class ChatController {
    constructor(
        private readonly chatService: ChatService,
        private readonly groupChatService: GroupChatService,
        private readonly directChatService: DirectChatService,
    ) {}

    @Get('')
    async getChatRooms(
        @Query('type', QueryParseStringPipe) type: string,
        @Query('page') page: number,
        @Req() req,
    ) {
        if (!page || page < 1) page = 1
        if (!type) return await this.chatService.getChatRooms(page)
        else if (type === 'GROUP')
            return await this.groupChatService.getGroupChats(req.user.login, page)
        else if (type === 'DM')
            return await this.directChatService.getDirectChats(req.user.login, page)
    }

    @Get('/:room_id')
    async getRoom(@Param('room_id', ParseUUIDPipe) room_id: string, @Req() req) {
        return await this.chatService.getChatRoom(room_id)
    }

    @Get('/:room_id/users')
    async getRoomUsers(
        @Param('room_id', ParseUUIDPipe) room_id: string,
        @Query('user_type', QueryParseStringPipe) user_type: string,
        @Req() req,
    ) {
        const room = await this.chatService.getChatRoom(room_id)
        if (room.type === ChatRoomType.DM)
            return await this.directChatService.getDirectChatUsers(room_id)
        else
            return user_type && user_type === 'BAN'
                ? await this.groupChatService.getGroupChatBannedUsers(room_id, ChatUserStatus.BAN)
                : await this.groupChatService.getGroupChatUsers(room_id)
    }

    @Get('/:room_id/messages')
    async getRoomMessages(
        @Param('room_id', ParseUUIDPipe) room_id: string,
        @Req() req,
        @Query('page') page: number,
        @Query('sort', QueryParseStringPipe) sort: string,
    ) {
        if (sort !== 'asc' && sort !== 'desc') throw new BadRequestException('Invalid sort type')
        if (!page || page < 1) page = 1
        const msgs = await this.chatService.getChatRoomMessages(room_id, page, sort, req.user.login)
        if (msgs == null) throw new NotFoundException('No Messages Found')
        return msgs
    }

    @Get('/:room_id/messages/me')
    async getRoomMessagesByUser(@Param('room_id', ParseUUIDPipe) room_id: string, @Req() req) {
        return await this.chatService.getChatUserMessagesInChatRoom(room_id, req.user.login)
    }

    @Get('/groupChat/me')
    async getGroupChat(@Req() req) {
        return await this.groupChatService.getGroupChatForUser(req.user.login)
    }

    @Get('/directChat/me')
    async getDirectChat(@Req() req) {
        return await this.directChatService.getDirectChatForUser(req.user.login)
    }

    @Get('/directChat/user/:user_login')
    async getDirectChatWitDh(@Req() req, @Param('user_login', ParseStringPipe) user_login: string) {
        return await this.directChatService.getDirectChatbetweenUsers(req.user.login, user_login)
    }

    @Get('/groupChat/search')
    async searchGroupChat(
        @Req() req,
        @Query('name', QueryParseStringPipe) search: string,
        @Query('page') page: number,
    ) {
        if (!page || page < 1) page = 1
        if (!search) return await this.groupChatService.getAllGroupChats(page)
        return await this.groupChatService.searchGroupChat(search, req.user.login, page)
    }
}
