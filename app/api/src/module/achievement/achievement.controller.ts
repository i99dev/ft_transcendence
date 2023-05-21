import { AchievementService } from './achievement.service'
import { Controller, NotFoundException, Param } from '@nestjs/common'
import { UseGuards, Req, Get, Query, Delete } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { AchievementDto } from './dto/achievement.dto'
import { ParseStringPipe } from '@common/pipes/string.pipe'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'
@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService) {}

    @UseGuards(JwtAuthGuard)
    @Get('user/:login')
    async getAchievements(
        @Param('login', ParseStringPipe) login: string,
    ): Promise<AchievementDto[]> {
        try {
            const ach = await this.achievementService.getAchievements(login)
            if (!ach) throw new NotFoundException('User Or Achievements not found')
            return ach
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
