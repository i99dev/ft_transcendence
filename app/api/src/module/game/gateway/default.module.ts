import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { DefaultGateway } from './default.gateway'
import { DefaultService } from './default.service'
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
    providers: [DefaultGateway, DefaultService, SocketService, Array],
})
export class DefaultModule {}
