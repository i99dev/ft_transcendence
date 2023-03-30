
import { PrismaService } from '@providers/prisma/prisma.service';
import { PrismaClient } from '@prisma/client'
import { ChatService } from './chat.service'
import { ChatController } from './chat.controller'
import { Module } from '@nestjs/common'
import { ChatWsModule } from './gateway/chatWs.module';

@Module({
    imports: [ChatWsModule],
    controllers: [ChatController],
    providers: [ChatService, PrismaClient, PrismaService],
    exports: [ChatService],
})
export class ChatModule {}