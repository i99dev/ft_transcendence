import { Controller, UseGuards, Get, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { LeaderboardService } from './leaderboard.service'

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    getLeaderboard(@Req() req): string {
        return 'boo'
    }
}
