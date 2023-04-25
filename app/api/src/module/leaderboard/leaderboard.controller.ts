import { Controller, UseGuards, Get, Req, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { LeaderboardService } from './leaderboard.service'
import { promises } from 'dns'
import { UserDto } from './dto/leaderboard.dto'

@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @Get('')
    async getLeaderboard(@Query('page') page: number): Promise<UserDto[]> {
        return await this.leaderboardService.getLeaderboard(page)
    }
    @Get('totalPages')
    async getTotalPages(): Promise<number> {
        return await this.leaderboardService.getTotalPages()
    }
}
