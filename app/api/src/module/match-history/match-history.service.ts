import { gameAnalyzer } from './../game/logic/gameAnalyzer'
import { Injectable } from '@nestjs/common'
import { MatchHistoryDto } from './dto/match-history.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@providers/prisma/prisma.service';

@Injectable()
export class MatchHistoryService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private gameAnalyzer: gameAnalyzer,
    ) {}
    readonly limit = 3

    async getLoginFromToken(authHeader: string): Promise<string> {
        const token = authHeader.split(' ')[1]
        return await this.jwtService.decode(token)['login']
    }

    async getTotalPages(player: string): Promise<number> {
        try {
            const count = await this.prisma.match.count({
                where: {
                    opponents: {
                        some: {
                            user: {
                                login: player,
                            },
                        },
                    },
                },
            })
            return Math.ceil(count / this.limit)
        } catch (error) {
            console.log(error)
        }
    }

    async getPlayerMatchHistory(page: number, player: string): Promise<MatchHistoryDto[]> {
        try {
            const skip = (page - 1) * this.limit
            const match = await this.prisma.match.findMany({
                where: {
                    opponents: {
                        some: {
                            user: {
                                login: player,
                            },
                        },
                    },
                },
                orderBy: {
                    start: 'desc',
                },
                include: {
                    opponents: {
                        include: {
                            user: true,
                        },
                    },
                },
                skip: skip,
                take: this.limit,
            })
            if (!match) return null
            return match
        } catch (error) {
            console.log(error)
        }
    }

    async getMatchHistoryByResult(
        page: number,
        player: string,
        winning: boolean,
    ): Promise<MatchHistoryDto[]> {
        const match = await this.getPlayerMatchHistory(page, player)
        if (!match) return null
        const winningMatch = []
        match.forEach(m => {
            if (m.opponents[0].user.login === player && m.opponents[0].IsWinner === winning) {
                winningMatch.push(m)
            } else if (
                m.opponents[1].user.login === player &&
                m.opponents[1].IsWinner === winning
            ) {
                winningMatch.push(m)
            }
        })
        return winningMatch
    }

    async getMatchHistoryBySort(
        page: number,
        player: string,
        sort: 'asc' | 'desc',
    ): Promise<MatchHistoryDto[]> {
        const match = await this.getPlayerMatchHistory(page, player)
        if (!match) return null
        match.sort((a, b) => {
            const userOpponentsA = a.opponents.filter(opponent => opponent.user.login === player)
            const userOpponentsB = b.opponents.filter(opponent => opponent.user.login === player)
            const scoreA = userOpponentsA.length > 0 ? userOpponentsA[0].score : 0
            const scoreB = userOpponentsB.length > 0 ? userOpponentsB[0].score : 0
            if (sort === 'desc') {
                if (scoreB - scoreA !== 0) {
                    return scoreB - scoreA
                } else {
                    return new Date(b.start).getTime() - new Date(a.start).getTime()
                }
            } else if (sort === 'asc') {
                if (scoreA - scoreB !== 0) {
                    return scoreA - scoreB
                } else {
                    return new Date(a.start).getTime() - new Date(b.start).getTime()
                }
            }
        })
        return match
    }
}
