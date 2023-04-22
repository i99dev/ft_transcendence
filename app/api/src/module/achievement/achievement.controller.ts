import { AchievementService } from './achievement.service'
import { Controller } from '@nestjs/common'
import { UseGuards, Req, Get, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'

@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService) {}

    @UseGuards(JwtAuthGuard)
    @Get('winningrate')
    async getWinnigRate(@Req() req): Promise<number> {
        console.log('WWINN RAATTEE !!!', req.user.login)
		console.log(
            'WWINN RAATTEE !!!',
            await this.achievementService.gameAnalyzer.calcWinRate(req.user.login),
        )
        return await this.achievementService.gameAnalyzer.calcWinRate(req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalgames') // /achievement/totalgames?Win=true&Lose=false
    async getTotal(
        @Query('Win') win: string,
        @Query('Lose') lose: string,
        @Req() req,
    ): Promise<number> {
        if (lose === 'true' && win === 'false')
            return await this.achievementService.gameAnalyzer.getTotalDefeats(req.user.login)
        else if (win === 'true' && lose === 'false')
            return await this.achievementService.gameAnalyzer.getTotalVictories(req.user.login)
        else return await this.achievementService.gameAnalyzer.getTotalMatches(req.user.login)
    }
}
