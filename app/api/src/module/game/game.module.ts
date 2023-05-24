import { Module, forwardRef } from '@nestjs/common'
import { MatchModule } from '@module/match/match.module'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { NotificationModule } from '@module/notification/notification.module'
import { GameWsModule } from './gateway/GameWs.module'
import { gameAnalyzer } from './logic/gameAnalyzer'
import { PongGame } from './logic/pongGame'
import { UserModule } from '@module/user/user.module'
import { AchievementModule } from '@module/achievement/achievement.module'

@Module({
    imports: [
        forwardRef(() => GameWsModule),
        MatchModule,
        PrismaModule,
        NotificationModule,
        UserModule,
        AchievementModule,
    ],
    providers: [gameAnalyzer, PongGame, String, Array],
    exports: [gameAnalyzer],
})
export class GameModule { }
