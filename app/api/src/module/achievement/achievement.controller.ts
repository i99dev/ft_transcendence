import { AchievementService } from './achievement.service'
import { Controller, Param } from '@nestjs/common'
import { UseGuards, Req, Get, Query } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { AchievementDto } from './dto/achievement.dto'
@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService) {}

    @UseGuards(JwtAuthGuard)
    @Get('winningrate/:login') // /achievement/winningrate/login
    async getWinnigRate(@Param('login') login: string): Promise<number> {
        return await this.achievementService.gameAnalyzer.calcWinRate(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalgames/:login') // /achievement/totalgames/login?Win=true&Lose=false
    async getTotal(
        @Query('Win') win: string,
        @Query('Lose') lose: string,
        @Param('login') login: string,
    ): Promise<number> {
        if (lose === 'true' && win === 'false')
            return await this.achievementService.gameAnalyzer.getTotalDefeats(login)
        else if (win === 'true' && lose === 'false')
            return await this.achievementService.gameAnalyzer.getTotalVictories(login)
        else return await this.achievementService.gameAnalyzer.getTotalMatches(login)
    }

    @Get('playertotalgames/:login') // /achievement/playertotalgames/player?Win=true&Lose=false&login=player1
    async getPlayerTotal(
        @Param('login') login: string,
        @Query('Win') win: string,
        @Query('Lose') lose: string,
    ): Promise<number> {
        if (lose === 'true' && win === 'false')
            return await this.achievementService.gameAnalyzer.getTotalDefeats(login)
        else if (win === 'true' && lose === 'false')
            return await this.achievementService.gameAnalyzer.getTotalVictories(login)
        else return await this.achievementService.gameAnalyzer.getTotalMatches(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/:login')
    async getAchievements(@Param('login') login: string): Promise<AchievementDto[]> {
        return await this.achievementService.getAchievements(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('new')
    async getNewAchievements(@Req() req): Promise<string[]> {
        return await this.achievementService.getNewAchievements(req.user.login)
    }
}
