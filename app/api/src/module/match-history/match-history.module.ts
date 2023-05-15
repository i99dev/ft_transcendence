import { Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryController } from './match-history.controller'
import { PrismaClient } from '@prisma/client'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'

@Module({
    imports: [AuthModule],
    controllers: [MatchHistoryController],
    providers: [MatchHistoryService, PrismaClient, gameAnalyzer],
    exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
