import { gameAnalyzer } from './../game/logic/gameAnalyzer'
import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { PosNumberPipe } from '@common/pipes/posNumber.pipe'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'
import { ParseStringPipe } from '@common/pipes/string.pipe'
@Controller('match-history/:login')
export class MatchHistoryController {
    constructor(
        private readonly matchHistoryService: MatchHistoryService,
        private gameAnalyzer: gameAnalyzer,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('') // /match-history?page=1
    async getPlayerMatchHistory(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
    ): Promise<MatchHistoryDto[]> {
        const matchHistory = await this.matchHistoryService.getPlayerMatchHistory(page, login)
        if (!matchHistory)
            throw new NotFoundException(`Match history for player ${login} not found`)
        return matchHistory
    }

    @UseGuards(JwtAuthGuard)
    @Get('result') // /match-history/result?winning=true&losing=false
    async getMatchHistoryByResult(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('winning', QueryParseStringPipe) winning: string,
        @Query('losing', QueryParseStringPipe) losing: string,
    ): Promise<MatchHistoryDto[]> {
        if (winning === 'true') {
            const history = await this.matchHistoryService.getMatchHistoryByResult(
                page,
                login,
                true,
            )
            if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
            return history
        } else if (losing === 'true') {
            const history = await this.matchHistoryService.getMatchHistoryByResult(
                page,
                login,
                false,
            )
            if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
            return history
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('score') // /match-history/score?sort=asc&sort=desc
    async getMatchHistoryBySort(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('sort', QueryParseStringPipe) sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        const history = await this.matchHistoryService.getMatchHistoryBySort(page, login, sort)
        if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
        return history
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalPages')
    async getTotalPages(@Param('login', ParseStringPipe) login: string): Promise<number> {
        return await this.matchHistoryService.getTotalPages(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalGames') // /match-history/totalgames/login?isWin=true
    async getTotal(
        @Param('login', ParseStringPipe) login: string,
        @Query('isWin', QueryParseStringPipe) isWin: 'true' | 'false' | undefined,
    ): Promise<number> {
        if (isWin === 'false') return await this.gameAnalyzer.getTotalDefeats(login)
        else if (isWin === 'true') return await this.gameAnalyzer.getTotalVictories(login)
        else return await this.gameAnalyzer.getTotalMatches(login)
    }
}
