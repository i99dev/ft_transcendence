import { AuthModule } from '@auth/auth.module'
import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { FriendModule } from '../friend.module'
import { FriendWsGateway } from './friendWs.gateway'
import { FriendWsService } from './friendWs.service'
import { PrismaClient } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { BlockModule } from '@module/block/block.module'
import { NotificationModule } from '@module/notification/notification.module'

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        forwardRef(() => FriendWsModule),
        BlockModule,
        FriendModule,
        NotificationModule,
    ],
    providers: [PrismaClient, JwtService, FriendWsGateway, FriendWsService],
    exports: [FriendWsService],
})
export class FriendWsModule {}
