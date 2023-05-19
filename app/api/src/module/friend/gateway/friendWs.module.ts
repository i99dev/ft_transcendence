import { AuthModule } from '@auth/auth.module'
import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { FriendModule } from '../friend.module'
import { FriendWsGateway } from './friendWs.gateway'
import { FriendWsService } from './friendWs.service'
import { JwtService } from '@nestjs/jwt'
import { BlockModule } from '@module/block/block.module'
import { NotificationModule } from '@module/notification/notification.module'
import { PrismaService } from '@providers/prisma/prisma.service'

@Module({
    imports: [AuthModule, PrismaModule, BlockModule, FriendModule, NotificationModule],
    providers: [FriendWsGateway, FriendWsService],
    exports: [FriendWsService],
})
export class FriendWsModule {}
