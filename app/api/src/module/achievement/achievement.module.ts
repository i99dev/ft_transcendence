import { AchievementService } from './achievement.service'
import { AchievementController } from './achievement.controller'
import { Module, forwardRef } from '@nestjs/common'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { NotificationModule } from '@module/notification/notification.module'
import { MatchModule } from '@module/match/match.module'
import { UserModule } from '@module/user/user.module'
import { GameModule } from '@module/game/game.module'

@Module({
    imports: [
        PrismaModule,
        NotificationModule,
        MatchModule,
        UserModule,
        forwardRef(() => GameModule),
    ],
    controllers: [AchievementController],
    providers: [AchievementService],
    exports: [AchievementService],
})
export class AchievementModule {}
