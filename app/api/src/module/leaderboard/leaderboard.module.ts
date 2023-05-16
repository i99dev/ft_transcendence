import { Module } from '@nestjs/common'
import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'
import { PrismaClient } from '@prisma/client'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'

@Module({
    imports: [],
    controllers: [LeaderboardController],
    providers: [LeaderboardService, PrismaClient, gameAnalyzer],
    exports: [LeaderboardService],
})
export class LeaderboardModule {}
