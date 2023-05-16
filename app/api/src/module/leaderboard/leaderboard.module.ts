import { Module } from '@nestjs/common'
import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaService } from '@providers/prisma/prisma.service'

@Module({
    imports: [],
    controllers: [LeaderboardController],
    providers: [LeaderboardService, PrismaService, gameAnalyzer],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}
