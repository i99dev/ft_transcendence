import { gameAnalyzer } from '@module/game/logic/gameAnalyzer';
import { Injectable } from '@nestjs/common'
import { AchievementDto } from './dto/achievement.dto'
import { NotificationType } from '@prisma/client'
import { PrismaService } from '@providers/prisma/prisma.service';

@Injectable({})
export class AchievementService {
    constructor(private gameAnalyzer: gameAnalyzer, private prisma: PrismaService) {}

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

    async deleteAchievNotification(user_login: string, content: string, type: string) {
        try {
            const notification = await this.prisma.notification.deleteMany({
                where: {
                    user_login: user_login,
                    content: content,
                    type: this.findType(type),
                },
            })
            return notification
        } catch (error) {
            console.log(error)
        }
    }

    async getNewAchievements(login: string): Promise<string[]> {
        const notification = await this.prisma.notification.findMany({
            where: {
                user_login: login,
                type: NotificationType.ACHIEVEMENT,
            },
        })
        if (!notification) return null
        if (notification.length) if (notification.length === 0) return null
        const achievements = []
        for (const notif of notification) {
            achievements.push(notif.content)
        }
        return achievements
    }
    async getNewRank(login: string): Promise<{ rank: string; isUp: boolean }> {
        const RankUp = await this.prisma.notification.findMany({
            where: {
                user_login: login,
                type: NotificationType.RANK_UP,
            },
        })
        const RankDown = await this.prisma.notification.findMany({
            where: {
                user_login: login,
                type: NotificationType.RANK_DOWN,
            },
        })

        if (RankUp.length !== 0 && RankUp[0].content !== null)
            return { rank: RankUp[0].content, isUp: false }
        if (RankDown.length !== 0 && RankDown[0].content !== null)
            return { rank: RankDown[0].content, isUp: true }

        return { rank: null, isUp: null }
    }
}
