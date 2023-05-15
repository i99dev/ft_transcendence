import { Module, forwardRef } from '@nestjs/common'
import { BlockController } from './block.controller'
import { BlockService } from './block.service'
import { PrismaService } from '@providers/prisma/prisma.service'
import { PrismaClient } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { FriendModule } from '@module/friend/friend.module'
import { FriendWsModule } from '@module/friend/gateway/friendWs.module'

@Module({
    imports: [FriendModule, forwardRef(() => FriendWsModule)],
    controllers: [BlockController],
    providers: [
        BlockService,
        PrismaService,
        PrismaClient,
        JwtService,
    ],
    exports: [BlockService],
})
export class BlockModule {}
