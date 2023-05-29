import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { PrismaModule } from '../../../providers/prisma/prisma.module'
import { UserModule } from '../../user/user.module'
import { ChatModule } from '../chat.module'
import { ChatWsGateway } from './chatWs.gateway'
import { ChatWsService } from './chatWs.service'
import { ConfigService } from '@nestjs/config'
import { FriendModule } from '@module/friend/friend.module'
import { FriendWsModule } from '@module/friend/gateway/friendWs.module'
import { NotificationModule } from '@module/notification/notification.module'
import { BlockModule } from '@module/block/block.module'

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        forwardRef(() => ChatModule),
        UserModule,
        FriendModule,
        FriendWsModule,
        NotificationModule,
        BlockModule,
    ],
    providers: [ChatWsGateway, ChatWsService, ConfigService],
})
export class ChatWsModule {}
