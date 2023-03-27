import { ChatService } from './chat.service'


export class ChatController {
    constructor(private readonly chatService: ChatService) {}
}