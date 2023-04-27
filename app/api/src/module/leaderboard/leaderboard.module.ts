import { Module } from '@nestjs/common'
import { LeaderboardController } from './leaderboard.controller'
import { LeaderboardService } from './leaderboard.service'

@Module({
    imports: [],
    providers: [LeaderboardService],
    controllers: [LeaderboardController],
})
export class LeaderboardModule {}