import { Module } from '@nestjs/common'
import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [LeaderboardController],
    providers: [LeaderboardService, gameAnalyzer],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}
