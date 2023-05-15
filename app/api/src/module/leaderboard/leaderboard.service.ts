import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { gameAnalyzer } from '../game/logic/gameAnalyzer'
import { UserGetDto } from '@module/user/dto/user.dto'

@Injectable()
export class LeaderboardService {
    private prisma = new PrismaClient()
    private readonly limit = 3
    private readonly gameAnalyzer = new gameAnalyzer()
    public async getLeaderboard(page: number): Promise<UserGetDto[]> {
        const users = await this.prisma.user.findMany({
            take: this.limit,
            skip: (page - 1) * this.limit,
            orderBy: [{ ladder: 'asc' }, { wr: 'desc' }],
        })
        return users
    }
    public async getTotalPages(): Promise<number> {
        const count = await this.prisma.user.count()
        return Math.ceil(count / this.limit)
    }
    public async getWinRate(login: string): Promise<number> {
        return await this.gameAnalyzer.calcWinRate(login)
    }
    public async getTotalMatches(login: string): Promise<number> {
        return await this.gameAnalyzer.getTotalMatches(login)
    }
}
