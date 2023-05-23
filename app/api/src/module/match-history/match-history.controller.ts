import { gameAnalyzer } from './../game/logic/gameAnalyzer'
import { BadRequestException, Controller, Get, NotFoundException, Param, Query, Req } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'
import { ParseStringPipe } from '@common/pipes/string.pipe'
@Controller('match-history/:login')
export class MatchHistoryController {
    constructor(
        private readonly matchHistoryService: MatchHistoryService,
        private gameAnalyzer: gameAnalyzer,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async getPlayerMatchHistory(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Req() req,
    ): Promise<MatchHistoryDto[]> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        const matchHistory = await this.matchHistoryService.getPlayerMatchHistory(page, login)
        if (!matchHistory)
            throw new NotFoundException(`Match history for player ${login} not found`)
        return matchHistory
    }

    @UseGuards(JwtAuthGuard)
    @Get('result')
    async getMatchHistoryByResult(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('isWin', QueryParseStringPipe) isWin: 'true' | 'false',
        @Req() req,
    ): Promise<MatchHistoryDto[]> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        if (isWin === 'true') {
            const history = await this.matchHistoryService.getMatchHistoryByResult(
                page,
                login,
                true,
            )
            if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
            return history
        } else if (isWin === 'false') {
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
    @Get('score')
    async getMatchHistoryBySort(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('sort', QueryParseStringPipe) sort: 'asc' | 'desc',
        @Req() req,
    ): Promise<MatchHistoryDto[]> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        const history = await this.matchHistoryService.getMatchHistoryBySort(page, login, sort)
        if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
        return history
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalPages')
    async getTotalPages(@Param('login', ParseStringPipe) login: string, @Req() req): Promise<number> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        return await this.matchHistoryService.getTotalPages(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalGames')
    async getTotal(
        @Param('login', ParseStringPipe) login: string,
        @Query('isWin', QueryParseStringPipe) isWin: 'true' | 'false' | undefined,
        @Req() req,
    ): Promise<number> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        if (isWin === 'false') return await this.gameAnalyzer.getTotalDefeats(login)
        else if (isWin === 'true') return await this.gameAnalyzer.getTotalVictories(login)
        else return await this.gameAnalyzer.getTotalMatches(login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('winningrate')
    async getWinningRate(@Param('login', ParseStringPipe) login: string, @Req() req): Promise<number> {
        if (login !== req.user.login) throw new BadRequestException('You cannot add a friend for someone else')
        return await this.gameAnalyzer.calcWinRate(login)
    }
}
