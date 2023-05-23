import { Module, forwardRef } from '@nestjs/common'
import { GameController } from './game.controller'
import { DefaultModule } from './gateway/default.module'
import { MatchModule } from '@module/match/match.module'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { NotificationModule } from '@module/notification/notification.module'
import { gameAnalyzer } from './logic/gameAnalyzer'
import { PongGame } from './logic/pongGame'
import { UserModule } from '@module/user/user.module'
import { AchievementModule } from '@module/achievement/achievement.module'

@Module({
    imports: [
        forwardRef(() => DefaultModule),
        MatchModule,
        PrismaModule,
        NotificationModule,
        UserModule,
        AchievementModule,
    ],
    controllers: [GameController],
    providers: [gameAnalyzer, PongGame, String, Array],
    exports: [gameAnalyzer],
})
export class GameModule {}
