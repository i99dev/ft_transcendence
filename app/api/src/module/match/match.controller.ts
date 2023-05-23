import {
    BadRequestException,
    Controller,
    Get,
    NotFoundException,
    Param,
    Query,
    Req,
} from '@nestjs/common'
import { MatchService } from './match.service'
import { MatchDto } from './dto/match.dto'
import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { ParseIntPipe } from '@nestjs/common'
import { QueryParseStringPipe } from '@common/pipes/queryString.pipe'
import { ParseStringPipe } from '@common/pipes/string.pipe'
import { gameAnalyzer } from '@module/game/logic/gameAnalyzer'

@UseGuards(JwtAuthGuard)
@Controller('match-history/:login')
export class MatchController {
    constructor(private readonly matchService: MatchService, private gameAnalyzer: gameAnalyzer) {}

    @Get('')
    async getPlayerMatchHistory(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Req() req,
    ): Promise<MatchDto[]> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        const matchHistory = await this.matchService.getPlayerMatchHistory(page, login)
        if (!matchHistory)
            throw new NotFoundException(`Match history for player ${login} not found`)
        return matchHistory
    }

    @Get('result')
    async getMatchHistoryByResult(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('isWin', QueryParseStringPipe) isWin: 'true' | 'false',
        @Req() req,
    ): Promise<MatchDto[]> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        if (isWin === 'true') {
            const history = await this.matchService.getMatchHistoryByResult(page, login, true)
            if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
            return history
        } else if (isWin === 'false') {
            const history = await this.matchService.getMatchHistoryByResult(page, login, false)
            if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
            return history
        }
    }

    @Get('score')
    async getMatchHistoryBySort(
        @Param('login', ParseStringPipe) login: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('sort', QueryParseStringPipe) sort: 'asc' | 'desc',
        @Req() req,
    ): Promise<MatchDto[]> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        const history = await this.matchService.getMatchHistoryBySort(page, login, sort)
        if (!history) throw new NotFoundException(`Match history for player ${login} not found`)
        return history
    }

    @Get('totalPages')
    async getTotalPages(
        @Param('login', ParseStringPipe) login: string,
        @Req() req,
    ): Promise<number> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        return await this.matchService.getTotalPages(login)
    }

    @Get('totalGames')
    async getTotal(
        @Param('login', ParseStringPipe) login: string,
        @Query('isWin', QueryParseStringPipe) isWin: 'true' | 'false' | undefined,
        @Req() req,
    ): Promise<number> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        if (isWin === 'false') return await this.matchService.getTotalDefeats(login)
        else if (isWin === 'true') return await this.matchService.getTotalVictories(login)
        else return await this.matchService.getTotalMatches(login)
    }

    @Get('winningrate')
    async getWinningRate(
        @Param('login', ParseStringPipe) login: string,
        @Req() req,
    ): Promise<number> {
        if (login !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        return await this.gameAnalyzer.calcWinRate(login)
    }
}
