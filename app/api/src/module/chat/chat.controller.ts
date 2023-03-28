import { ChatRoomDto } from './dto/chat.dto';
import { Patch, Post, UsePipes, Get, Param } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { ChatPostValidation, UserPostValidation } from './pipe/chat.pipe'


@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('/room')
    @UsePipes(ChatPostValidation)
    async createRoom(@Body() data: ChatRoomDto) {
        console.log(data);  
        return await this.chatService.createRoom(data);
    }

    @Get('/room/:room_id')
    async getRoom(@Param('room_id') room_id: string) {
        return await this.chatService.getRoom(room_id)
    }

    @Post('/room/:room_id')
    @UsePipes(UserPostValidation)
    async addUserToRoom(@Param('room_id') room_id: string, @Body() data) {
        return await this.chatService.addUserToRoom(room_id, data);
    }
}