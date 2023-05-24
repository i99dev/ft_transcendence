import { NotificationService } from '@module/notification/notification.service'
import { Injectable } from '@nestjs/common'
import { AchievementDto } from './dto/achievement.dto'
import { Achievement, NotificationType } from '@prisma/client'
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

    async getAchievementType(achievement: string) {
        try {
            const achievementType = await this.prisma.achievement.findUnique({
                where: {
                    type: achievement,
                },
            })
            return achievementType
        } catch (error) {
            console.log(error)
        }
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

    async getNewRank(login: string): Promise<{ rank: string; isUp: boolean; id: number }> {
        const RankUp = await this.notificationService.getMyNotificationsByType(
            login,
            NotificationType.RANK_UP,
        )
        const RankDown = await this.notificationService.getMyNotificationsByType(
            login,
            NotificationType.RANK_DOWN,
        )

        if (RankUp) {
            if (RankUp.length !== 0 && RankUp[0].content !== null)
                return { rank: RankUp[0].content, isUp: false, id: RankUp[0].id }
        }
        if (RankDown) {
            if (RankDown.length !== 0 && RankDown[0].content !== null)
                return { rank: RankDown[0].content, isUp: true, id: RankDown[0].id }
        }

        return { rank: null, isUp: null, id: -1 }
    }

    async addAchievement(player: string, ach: Achievement) {
        try {
            const done = await this.prisma.user.update({
                where: {
                    login: player,
                },
                data: {
                    achievements: {
                        connect: {
                            id: ach.id,
                        },
                    },
                },
            })
            return done
        } catch (error) {
            console.log(error)
        }
    }

    async checkPlayerAchievements(player: string, ach: string) {
        try {
            const count = await this.prisma.user.count({
                where: {
                    login: player,
                    achievements: {
                        some: {
                            type: ach,
                        },
                    },
                },
            })
            return count
        } catch (error) {
            console.log(error)
        }
    }
}
