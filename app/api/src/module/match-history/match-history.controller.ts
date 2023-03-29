import { Controller } from '@nestjs/common'
import { Get, Param, Query } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
@Controller('match-history')
export class MatchHistoryController {
    private matchHistoryService = new MatchHistoryService()

    @Get(':player') // /match-history/:playerId
    getPlayerMatchHistory(@Param('player') player: string) {
        return this.matchHistoryService.getPlayerMatchHistory(player)
        // return `Match history for ${player}`
    }

    @Get(':player') // /match-history/:playerId?winning=true&losing=false
    getMatchHistoryByResult(
        @Param('player') player: string,
        @Query('winning') winning: boolean,
        @Query('losing') losing: boolean,
    ) {
        if (winning === undefined && losing === undefined)
            return this.matchHistoryService.getPlayerMatchHistory(player)
        else if (winning === losing) return 'You can only choose one of winning or losing'
        else if (winning === true && losing === false)
            return this.matchHistoryService.getMatchHistoryByResult(player, winning)
        // return `Match history for ${player} with winning=${winning} and losing=${losing}`
    }

    @Get(':player') // /match-history/:playerId?sort=score_asc
    getMatchHistoryBySort(
        @Param('player') player: string,
        @Query('sort') sort: 'score_asc' | 'score_des',
    ) {
        return `Match history for ${player} sorted by ${sort}`
    }
}
