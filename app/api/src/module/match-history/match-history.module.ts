import { Module } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryController } from './match-history.controller'

@Module({
    providers: [MatchHistoryService],
    controllers: [MatchHistoryController],
})
export class MatchHistoryModule {}
