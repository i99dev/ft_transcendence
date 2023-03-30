import { Controller } from '@nestjs/common'
import { Get, Param, Query } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
@Controller('match-history')
export class MatchHistoryController {
    private matchHistoryService = new MatchHistoryService()

    @Get(':player') // /match-history/:playerId
    async getPlayerMatchHistory(@Param('player') player: string): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getPlayerMatchHistory(player)
        // return `Match history for ${player}`
    }

    @Get(':player/result') // /match-history/:playerId/result?winning=true&losing=false
    async getMatchHistoryByResult(
        @Param('player') player: string,
        @Query('winning') winning: string,
        @Query('losing') losing: string,
    ): Promise<MatchHistoryDto[]> {
        if (winning === undefined && losing === undefined)
            return await this.matchHistoryService.getPlayerMatchHistory(player)
        else if (winning === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(player, true)
        else if (losing === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(player, false)
        // return `Match history for ${player} with winning=${winning} and losing=${losing}`
    }

    @Get(':player/score') // /match-history/:playerId/score?sort=asc&sort=desc
    async getMatchHistoryBySort(
        @Param('player') player: string,
        @Query('sort') sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getMatchHistoryBySort(player, sort)
        // return `Match history for ${player} sorted by ${sort}`
    }
}
