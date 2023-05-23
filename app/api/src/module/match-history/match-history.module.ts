import { Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryController } from './match-history.controller'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [MatchHistoryController],
    providers: [MatchHistoryService, gameAnalyzer],
    exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
