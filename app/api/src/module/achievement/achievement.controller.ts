import { AchievementService } from './achievement.service'
import { Controller, NotFoundException, Param } from '@nestjs/common'
import { UseGuards, Req, Get } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { AchievementDto } from './dto/achievement.dto'
import { ParseStringPipe } from '@common/pipes/string.pipe'
@UseGuards(JwtAuthGuard)
@Controller('achievement')
export class AchievementController {
    constructor(private readonly achievementService: AchievementService) {}

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

    @Get('newRank')
    async getNewRank(@Req() req): Promise<{ rank: string; isUp: boolean }> {
        return await this.achievementService.getNewRank(req.user.login)
    }

    @Get('')
    async getAllAchievements(): Promise<AchievementDto[]> {
        return await this.achievementService.getAllAchievements()
    }
}
