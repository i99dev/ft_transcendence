import { Post, UsePipes } from '@nestjs/common'
import { ChatService } from './chat.service'
import { Controller } from '@nestjs/common'
import { Body } from '@nestjs/common'


@Controller('/chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}
}