import { Controller, Get, Query } from '@nestjs/common'
import { MatchHistoryService } from './match-history.service'
import { MatchHistoryDto } from './dto/match-history.dto'
import { UseGuards, Req } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
@Controller('match-history')
export class MatchHistoryController {
    constructor(private readonly matchHistoryService: MatchHistoryService) {}

    @UseGuards(JwtAuthGuard)
    @Get('') // /match-history?page=1
    async getPlayerMatchHistory(
        @Req() req,
        @Query('page') page: number,
    ): Promise<MatchHistoryDto[]> {
        console.log('REQUEST!!!!', req.user.login)
        return await this.matchHistoryService.getPlayerMatchHistory(page, req.user.login)
    }

    @UseGuards(JwtAuthGuard)
    @Get('result') // /match-history/result?winning=true&losing=false
    async getMatchHistoryByResult(
        @Req() req,
        @Query('page') page: number,
        @Query('winning') winning: string,
        @Query('losing') losing: string,
    ): Promise<MatchHistoryDto[]> {
        if (winning === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(
                page,
                req.user.login,
                true,
            )
        else if (losing === 'true')
            return await this.matchHistoryService.getMatchHistoryByResult(
                page,
                req.user.login,
                false,
            )
    }

    @UseGuards(JwtAuthGuard)
    @Get('score') // /match-history/score?sort=asc&sort=desc
    async getMatchHistoryBySort(
        @Req() req,
        @Query('page') page: number,
        @Query('sort') sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        return await this.matchHistoryService.getMatchHistoryBySort(page, req.user.login, sort)
    }

    @UseGuards(JwtAuthGuard)
    @Get('totalPages')
    async getTotalPages(@Req() req): Promise<number> {
        return await this.matchHistoryService.getTotalPages(req.user.login)
    }
}
