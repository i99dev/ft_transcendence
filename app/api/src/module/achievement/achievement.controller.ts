import { AchievementService } from './achievement.service'
import { Controller, NotFoundException, Param } from '@nestjs/common'
import { UseGuards, Req, Get, Query, Delete } from '@nestjs/common'
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
    @Delete('/:content')
    async deleteAchievNotification(
        @Param('content') content: string,
        @Query() type: string,
        @Req() req,
    ) {
        return await this.achievementService.deleteAchievNotification(req.user.login, content, type)
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:login')
    async getAchievements(@Param('login') login: string): Promise<AchievementDto[]> {
        try {
            const ach = await this.achievementService.getAchievements(login)
            if (!ach)
                throw new NotFoundException('User Or Achievements not found')
            return ach;
        } catch (error) {
            console.log(error)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('new')
    async getNewAchievements(@Req() req): Promise<any> {
        try {
            const achievement = await this.achievementService.getNewAchievements(req.user.login)
            if (!achievement)
                throw new NotFoundException('Achievements not found')
            return achievement
        } catch (error) {
            console.log(error)
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('newRank')
    async getNewRank(@Req() req): Promise<{ rank: string; isUp: boolean }> {
        return await this.achievementService.getNewRank(req.user.login)
    }
}
