import { Controller, Get, Query } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { UserGetDto } from '@module/user/dto/user.dto'

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @Get('')
    async getLeaderboard(@Query('page') page: number): Promise<UserGetDto[]> {
        return await this.leaderboardService.getLeaderboard(page)
    }
    @Get('totalPages')
    async getTotalPages(): Promise<number> {
        return await this.leaderboardService.getTotalPages()
    }
}
