import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { gameAnalyzer } from '../game/logic/gameAnalyzer'
import { AchievementDto } from './dto/achievement.dto'
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
}
