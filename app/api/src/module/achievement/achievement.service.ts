import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { gameAnalyzer } from '../game/logic/gameAnalyzer'
import { AchievementDto } from './dto/achievement.dto'
import { NotificationType } from '@prisma/client'

@Injectable({})
export class AchievementService {
    public gameAnalyzer = new gameAnalyzer()
    private prisma = new PrismaClient()

    async getAchievements(login: string): Promise<AchievementDto[]> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
            include: {
                achievements: true,
            },
        })
        return user.achievements
    }

    async deleteAchievNotification(user_login: string, content: string) {
        try {
            const notification = await this.prisma.notification.deleteMany({
                where: {
                    user_login: user_login,
                    content: content,
                    type: 'ACHIEVEMENT',
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
        if (notification.length === 0) return []
        const achievements = []
        for (const notif of notification) {
            achievements.push(notif.content)
        }
        return achievements
    }
}
