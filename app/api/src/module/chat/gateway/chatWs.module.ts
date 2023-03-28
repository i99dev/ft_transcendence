import { Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from '../../../auth/auth.module'
import { PrismaModule } from '../../../providers/prisma/prisma.module'
import { ChatWsGateway } from './chatWs.gateway'
import { ChatWsService } from './chatWs.service'

@Module({
    imports: [AuthModule, PrismaModule],
    providers: [ChatWsGateway, ChatWsService, PrismaClient],
})
export class ChatWsModule {}
