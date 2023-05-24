import { Module } from '@nestjs/common'
import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { MatchModule } from '@module/match/match.module'
import { NotificationModule } from '@module/notification/notification.module'
import { GameModule } from '@module/game/game.module'

@Module({
    imports: [PrismaModule, MatchModule, NotificationModule, GameModule],
    controllers: [LeaderboardController],
    providers: [LeaderboardService],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}
