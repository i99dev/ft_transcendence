import { Module, forwardRef } from '@nestjs/common'
import { BlockController } from './block.controller'
import { BlockService } from './block.service'
import { PrismaService } from '@providers/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'
import { FriendModule } from '@module/friend/friend.module'
import { FriendWsModule } from '@module/friend/gateway/friendWs.module'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [FriendModule, forwardRef(() => FriendWsModule), PrismaModule],
    controllers: [BlockController],
    providers: [BlockService, JwtService],
    exports: [BlockService],
})
export class BlockModule {}
