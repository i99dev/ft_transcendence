import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { MatchService } from './match.service'
import { MatchController } from './match.controller'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { NotificationModule } from '@module/notification/notification.module'
import { GameModule } from '@module/game/game.module'

@Module({
    imports: [AuthModule, PrismaModule, NotificationModule, forwardRef(() => GameModule)],
    controllers: [MatchController],
    providers: [MatchService],
    exports: [MatchService],
})
export class MatchModule {}
