import { AchievementService } from './achievement.service'
import { AchievementController } from './achievement.controller'
import { Module } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [PrismaModule],
    controllers: [AchievementController],
    providers: [AchievementService, gameAnalyzer],
})
export class AchievementModule {}
