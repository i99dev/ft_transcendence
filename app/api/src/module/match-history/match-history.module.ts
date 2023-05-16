import { Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryController } from './match-history.controller'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaService } from '@providers/prisma/prisma.service'

@Module({
    imports: [AuthModule],
    controllers: [MatchHistoryController],
    providers: [MatchHistoryService, PrismaService, gameAnalyzer],
    exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
