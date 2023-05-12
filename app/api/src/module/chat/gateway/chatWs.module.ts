import { forwardRef, Module } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { AuthModule } from '../../../auth/auth.module'
import { PrismaModule } from '../../../providers/prisma/prisma.module'
import { UserModule } from '../../user/user.module'
import { ChatModule } from '../chat.module'
import { ChatWsGateway } from './chatWs.gateway'
import { ChatWsService } from './chatWs.service'
import { NotificationService } from '@module/notification/notification.service'
import { BlockService } from '@module/block/block.service'
import { FriendWsModule } from '@module/friend/gateway/friendWs.module'
import { FriendWsService } from '@module/friend/gateway/friendWs.service'
import { FriendService } from '@module/friend/friend.service'
import { FriendRepository } from '@module/friend/repository/friend.repository'
import { FriendModule } from '@module/friend/friend.module'

@Module({
    imports: [AuthModule, PrismaModule, forwardRef(() => ChatModule), UserModule],
    providers: [ChatWsGateway, ChatWsService, PrismaClient, NotificationService, BlockService, FriendWsService, FriendService, FriendRepository],
})
export class ChatWsModule {}
