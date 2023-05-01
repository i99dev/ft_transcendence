import { Controller, Get, Param, Query } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
@Controller('match-history/:login')
export class MatchHistoryController {
    constructor(private readonly matchHistoryService: MatchHistoryService) {}

    @UseGuards(JwtAuthGuard)
    @Get('') // /match-history?page=1
    async getPlayerMatchHistory(
        @Param('login') login: string,
        @Query('page') page: number,
    ): Promise<MatchHistoryDto[]> {
        console.log('REQUEST!!!!', login)
        return await this.matchHistoryService.getPlayerMatchHistory(page, login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('result') // /match-history/result?winning=true&losing=false
    async getMatchHistoryByResult(
        @Param('login') login: string,
        @Query('page') page: number,
        @Query('winning') winning: string,
        @Query('losing') losing: string,
    ): Promise<MatchHistoryDto[]> {
        if (winning === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(page, login, true)
        else if (losing === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(page, login, false)
    }

    @UseGuards(JwtAuthGuard)
    @Get('score') // /match-history/score?sort=asc&sort=desc
    async getMatchHistoryBySort(
        @Param('login') login: string,
        @Query('page') page: number,
        @Query('sort') sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getMatchHistoryBySort(page, login, sort)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalPages')
    async getTotalPages(@Param('login') login: string): Promise<number> {
        return await this.matchHistoryService.getTotalPages(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalgames') // /match-history/totalgames/login?Win=true&Lose=false
    async getTotal(
        @Query('Win') win: string,
        @Query('Lose') lose: string,
        @Param('login') login: string,
    ): Promise<number> {
        if (lose === 'true' && win === 'false')
            return await this.matchHistoryService.gameAnalyzer.getTotalDefeats(login)
        else if (win === 'true' && lose === 'false')
            return await this.matchHistoryService.gameAnalyzer.getTotalVictories(login)
        else return await this.matchHistoryService.gameAnalyzer.getTotalMatches(login)
    }
}
