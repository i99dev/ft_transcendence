import { Controller, Get, Query, Headers } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
@Controller('match-history')
export class MatchHistoryController {
    constructor(private readonly matchHistoryService: MatchHistoryService) {}

    @Get('') // /match-history
    async getPlayerMatchHistory(
        @Headers('authorization') authHeader: string,
    ): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getPlayerMatchHistory(
            await this.matchHistoryService.getLoginFromToken(authHeader),
        )
    }

    @Get('result') // /match-history/result?winning=true&losing=false
    async getMatchHistoryByResult(
        @Headers('authorization') authHeader: string,
        @Query('winning') winning: string,
        @Query('losing') losing: string,
    ): Promise<MatchHistoryDto[]> {
        const player = await this.matchHistoryService.getLoginFromToken(authHeader)
        if (winning === undefined && losing === undefined)
            return await this.matchHistoryService.getPlayerMatchHistory(player)
        else if (winning === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(player, true)
        else if (losing === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(player, false)
    }

    @Get('score') // /match-history/score?sort=asc&sort=desc
    async getMatchHistoryBySort(
        @Headers('authorization') authHeader: string,
        @Query('sort') sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getMatchHistoryBySort(
            await this.matchHistoryService.getLoginFromToken(authHeader),
            sort,
        )
    }
}
