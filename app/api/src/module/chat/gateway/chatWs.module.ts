import { forwardRef, Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from '../../../auth/auth.module'
import { PrismaModule } from '../../../providers/prisma/prisma.module'
import { UserModule } from '../../user/user.module'
import { ChatModule } from '../chat.module'
import { ChatWsGateway } from './chatWs.gateway'
import { ChatWsService } from './chatWs.service'

@Module({
    imports: [AuthModule, PrismaModule, forwardRef(() => ChatModule), UserModule],
    providers: [ChatWsGateway, ChatWsService, PrismaClient],
})
export class ChatWsModule {}
