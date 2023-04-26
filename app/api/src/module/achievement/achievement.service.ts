import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { gameAnalyzer } from '../game/logic/gameAnalyzer'

@Injectable({})
export class AchievementService {
    public gameAnalyzer = new gameAnalyzer()
}
