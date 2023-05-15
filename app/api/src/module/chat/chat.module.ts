import { PrismaService } from '../../providers/prisma/prisma.service'
import { PrismaClient } from '@prisma/client'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { Module } from '@nestjs/common'
import { GroupChatService } from './groupChat.service'
import { ChatRepository } from './repository/chat.repository'
import { DirectChatService } from './directChat.service'

@Module({
    imports: [],
    controllers: [ChatController],
    providers: [
        ChatService,
        PrismaClient,
        PrismaService,
        GroupChatService,
        ChatRepository,
        DirectChatService,
    ],
    exports: [ChatService, GroupChatService, DirectChatService, ChatRepository],
})
export class ChatModule {}
