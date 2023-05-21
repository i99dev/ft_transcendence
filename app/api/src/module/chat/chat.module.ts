import { PrismaService } from '../../providers/prisma/prisma.service'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { Module, forwardRef } from '@nestjs/common'
import { GroupChatService } from './groupChat.service'
import { ChatRepository } from './repository/chat.repository'
import { DirectChatService } from './directChat.service'
import { ChatWsModule } from './gateway/chatWs.module'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [forwardRef(() => ChatWsModule), PrismaModule],
    controllers: [ChatController],
    providers: [ChatService, GroupChatService, ChatRepository, DirectChatService],
    exports: [ChatService, GroupChatService, DirectChatService, ChatRepository],
})
export class ChatModule {}
