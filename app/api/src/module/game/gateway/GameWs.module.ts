import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { GameWsGateway } from './GameWs.gateway'
import { GameWsService } from './GameWs.service'
import { SocketService } from './socket.service'
import { GameModule } from '../game.module'
import { BlockModule } from '@module/block/block.module'
import { MatchModule } from '@module/match/match.module'
import { NotificationModule } from '@module/notification/notification.module'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { UserModule } from '@module/user/user.module'

@Module({
    imports: [
        AuthModule,
        forwardRef(() => GameModule),
        BlockModule,
        MatchModule,
        NotificationModule,
        PrismaModule,
        UserModule,
    ],
    providers: [GameWsGateway, GameWsService, SocketService, Array],
})
export class GameWsModule { }
