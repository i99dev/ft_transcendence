import { gameAnalyzer } from '@module/game/logic/gameAnalyzer';
import { Injectable, NotFoundException } from '@nestjs/common'
import { UserGetDto } from '@module/user/dto/user.dto'
import { PrismaService } from '@providers/prisma/prisma.service'
import { MatchService } from '@module/match/match.service'

@Injectable()
export class LeaderboardService {
    constructor(private prisma: PrismaService, private gameAnalyzer: gameAnalyzer, private matchService: MatchService) {}

    private readonly limit = 3

    public async getLeaderboard(page: number): Promise<UserGetDto[]> {
        try {
            const users = await this.prisma.user.findMany({
                take: this.limit,
                skip: (page - 1) * this.limit,
                orderBy: [{ ladder: 'asc' }, { wr: 'desc' }],
            })
            if (!users) return null
            return users
        } catch (error) {
            throw new NotFoundException('Leaderboard not found')
        }
    }

    public async getTotalPages(): Promise<number> {
        const count = await this.prisma.user.count()
        return Math.ceil(count / this.limit)
    }

    public async getWinRate(login: string): Promise<number> {
        return await this.gameAnalyzer.calcWinRate(login)
    }

    public async getTotalMatches(login: string): Promise<number> {
        return await this.matchService.getTotalMatches(login)
    }
}
