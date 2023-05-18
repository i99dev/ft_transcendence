import { AchievementService } from './achievement.service'
import { AchievementController } from './achievement.controller'
import { Module } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'

@Module({
    imports: [],
    controllers: [AchievementController],
    providers: [AchievementService, PrismaService, gameAnalyzer],
})
export class AchievementModule {}
