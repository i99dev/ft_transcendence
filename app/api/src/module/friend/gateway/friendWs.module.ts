import { AuthModule } from '@auth/auth.module'
import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { FriendModule } from '../friend.module'
import { FriendWsGateway } from './friendWs.gateway'
import { FriendWsService } from './friendWs.service'
import { PrismaClient } from '@prisma/client'
import { NotificationService } from '@module/notification/notification.service'
import { JwtService } from '@nestjs/jwt'
import { FriendService } from '../friend.service'
import { FriendRepository } from '../repository/friend.repository'
import { BlockService } from '@module/block/block.service'

@Module({
    imports: [AuthModule, PrismaModule, forwardRef(() => FriendModule)],
    providers: [
        FriendWsGateway,
        FriendWsService,
        PrismaClient,
        NotificationService,
        FriendModule,
        JwtService,
        FriendService,
        FriendRepository,
        BlockService,
    ],
})
export class FriendWsModule {}
