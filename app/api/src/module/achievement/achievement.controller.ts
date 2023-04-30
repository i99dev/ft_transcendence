import { AchievementService } from './achievement.service'
import { Controller, Param } from '@nestjs/common'
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
    async deleteAchievNotification(@Param('content') content: string, @Req() req) {
        console.log('delete Notification')
        return await this.achievementService.deleteAchievNotification(req.user.login, content)
    }

    @UseGuards(JwtAuthGuard)
    @Get('user/:login')
    async getAchievements(@Param('login') login: string): Promise<AchievementDto[]> {
        return await this.achievementService.getAchievements(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('new')
    async getNewAchievements(@Req() req): Promise<string[]> {
        return await this.achievementService.getNewAchievements(req.user.login)
    }
}
