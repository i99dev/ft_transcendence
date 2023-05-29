import { AuthModule } from '@auth/auth.module'
import { Module } from '@nestjs/common'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { FriendModule } from '../friend.module'
import { FriendWsGateway } from './friendWs.gateway'
import { FriendWsService } from './friendWs.service'
import { BlockModule } from '@module/block/block.module'
import { NotificationModule } from '@module/notification/notification.module'

@Module({
    imports: [AuthModule, PrismaModule, BlockModule, FriendModule, NotificationModule],
    providers: [FriendWsGateway, FriendWsService],
    exports: [FriendWsService],
})
export class FriendWsModule {}
