import { Controller } from '@nestjs/common'
import { Get, Param, Query } from '@nestjs/common'

@Controller('match-history')
export class MatchHistoryController {
    @Get('')
    getMatchHistory() {
        return 'Match history'
    }

    @Get(':player') // /match-history/:playerId
    getPlayerMatchHistory(@Param('player') player: string) {
        return `Match history for ${player}`
    }

    @Get(':player') // /match-history/:playerId?winning=true&losing=false
    getMatchHistoryByResult(
        @Param('player') player: string,
        @Query('winning') winning: boolean,
        @Query('losing') losing: boolean,
    ) {
        return `Match history for ${player} with winning=${winning} and losing=${losing}`
    }

    @Get(':player') // /match-history/:playerId?sort=score_asc
    getMatchHistoryBySort(
        @Param('player') player: string,
        @Query('sort') sort: 'score_asc' | 'score_des',
    ) {
        return `Match history for ${player} sorted by ${sort}`
    }
}
