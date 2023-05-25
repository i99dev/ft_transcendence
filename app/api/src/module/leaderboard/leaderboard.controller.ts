import { Controller, Get, NotFoundException, Query, UseGuards } from '@nestjs/common'
import { LeaderboardService } from './leaderboard.service'
import { UserGetDto } from '@module/user/dto/user.dto'
import { PosNumberPipe } from '@common/pipes/posNumber.pipe'
import { JwtAuthGuard } from '@common/guards/jwt.guard'

@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
    constructor(private readonly leaderboardService: LeaderboardService) {}

    @Get('')
    async getLeaderboard(@Query('page') page: number): Promise<UserGetDto[]> {
        if (!page || page < 1) page = 1
        const ldr = await this.leaderboardService.getLeaderboard(page)
        if (!ldr) throw new NotFoundException('Leaderboard not found')
        return ldr
    }

    @Get('totalPages')
    async getTotalPages(): Promise<number> {
        return await this.leaderboardService.getTotalPages()
    }
}
