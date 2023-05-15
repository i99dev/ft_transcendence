import { Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryController } from './match-history.controller'

@Module({
    imports: [AuthModule],
    controllers: [MatchHistoryController],
    providers: [MatchHistoryService],
    exports: [MatchHistoryService],
})
export class MatchHistoryModule {}
