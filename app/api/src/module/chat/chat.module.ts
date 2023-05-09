import { PrismaService } from '../../providers/prisma/prisma.service'
import { PrismaClient } from '@prisma/client'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { forwardRef, Module } from '@nestjs/common'
import { ChatWsModule } from './gateway/chatWs.module'
import { GroupChatService } from './groupChat.service'
import { ChatRepository } from './repository/chat.repository'

@Module({
    imports: [forwardRef(() => ChatWsModule)],
    controllers: [ChatController],
    providers: [ChatService, PrismaClient, PrismaService, GroupChatService, ChatRepository],
    exports: [ChatService, GroupChatService],
})
export class ChatModule {}
