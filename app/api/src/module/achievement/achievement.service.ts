import { NotificationService } from '@module/notification/notification.service';
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { Injectable } from '@nestjs/common'
import { AchievementDto } from './dto/achievement.dto'
import { NotificationType } from '@prisma/client'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable({})
export class AchievementService {
    constructor(private notificationService: NotificationService, private prisma: PrismaService) {}

    async getAchievements(login: string): Promise<AchievementDto[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
            include: {
                achievements: true,
            },
        })
        if (!user || !user.achievements) return null
        return user.achievements
    }

    findType(type: string): NotificationType {
        switch (type) {
            case 'ACHIEVEMENT':
                return NotificationType.ACHIEVEMENT
            case 'RANK_UP':
                return NotificationType.RANK_UP
            case 'RANK_DOWN':
                return NotificationType.RANK_DOWN
        }
    }

    async getNewRank(login: string): Promise<{ rank: string; isUp: boolean }> {
        const RankUp = await this.notificationService.getMyNotificationsByType(login, NotificationType.RANK_UP)
        const RankDown = await this.notificationService.getMyNotificationsByType(login, NotificationType.RANK_DOWN)

        if (RankUp) {
            if (RankUp.length !== 0 && RankUp[0].content !== null)
                return { rank: RankUp[0].content, isUp: false }
        }
        if (RankDown) {
            if (RankDown.length !== 0 && RankDown[0].content !== null)
                return { rank: RankDown[0].content, isUp: true }
        }

        return { rank: null, isUp: null }
    }
}
