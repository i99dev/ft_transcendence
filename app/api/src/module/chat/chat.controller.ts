import { ChatRoomDto } from './dto/chat.dto';
import { Patch, Post, UsePipes } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { Body } from '@nestjs/common'
import { ChatPostValidation } from './pipe/chat.pipe'


@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('/room')
    @UsePipes(ChatPostValidation)
    createRoom(@Body() data: ChatRoomDto): boolean {
        console.log(data);  
        this.chatService.createRoom(data);
        return true;
    }
}