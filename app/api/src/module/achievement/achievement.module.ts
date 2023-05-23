import { AchievementService } from './achievement.service'
import { AchievementController } from './achievement.controller'
import { Module } from '@nestjs/common'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaModule } from '@providers/prisma/prisma.module'
import { NotificationModule } from '@module/notification/notification.module'

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [AchievementController],
    providers: [AchievementService, gameAnalyzer],
})
export class AchievementModule {}
