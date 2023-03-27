import { Post } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'


@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('/room')
    createRoom():boolean {
        return true;
    }
}