import { Injectable } from '@nestjs/common'
import { MatchDto } from './dto/match.dto'
import { JwtService } from '@nestjs/jwt'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable()
export class MatchService {
    constructor(private jwtService: JwtService, private prisma: PrismaService) {}
    readonly limit = 3

    async getLoginFromToken(authHeader: string): Promise<string> {
        const token = authHeader.split(' ')[1]
        return await this.jwtService.decode(token)['username']
    }

    async getTotalPages(player: string): Promise<number> {
        try {
            const count = await this.prisma.match.count({
                where: {
                    opponents: {
                        some: {
                            user: {
                                username: player,
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

    async getPlayerMatchHistory(page: number, player: string): Promise<MatchDto[]> {
        try {
            const skip = (page - 1) * this.limit
            const match = await this.prisma.match.findMany({
                where: {
                    opponents: {
                        some: {
                            user: {
                                username: player,
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
    ): Promise<MatchDto[]> {
        const match = await this.getPlayerMatchHistory(page, player)
        if (!match) return null
        const winningMatch = []
        match.forEach(m => {
            if (m.opponents[0].user.username === player && m.opponents[0].IsWinner === winning) {
                winningMatch.push(m)
            } else if (
                m.opponents[1].user.username === player &&
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
    ): Promise<MatchDto[]> {
        const match = await this.getPlayerMatchHistory(page, player)
        if (!match) return null
        match.sort((a, b) => {
            const userOpponentsA = a.opponents.filter(opponent => opponent.user.username === player)
            const userOpponentsB = b.opponents.filter(opponent => opponent.user.username === player)
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

    async getTotalVictories(player: string): Promise<number> {
        return await this.prisma.match.count({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
                        },
                        IsWinner: true,
                    },
                },
            },
        })
    }

    async getTotalDefeats(player: string): Promise<number> {
        return await this.prisma.match.count({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
                        },
                        IsWinner: false,
                    },
                },
            },
        })
    }

    async getTotalMatches(player: string): Promise<number> {
        return await this.prisma.match.count({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
                        },
                    },
                },
            },
        })
    }

    async getMatches(player: string): Promise<MatchDto[]> {
        return await this.prisma.match.findMany({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
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
        })
    }

    async getVictories(player: string): Promise<MatchDto[]> {
        return await this.prisma.match.findMany({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
                        },
                        IsWinner: true,
                    },
                },
            },
        })
    }

    async getDefeats(player: string): Promise<MatchDto[]> {
        return await this.prisma.match.findMany({
            where: {
                opponents: {
                    some: {
                        user: {
                            username: player,
                        },
                        IsWinner: false,
                    },
                },
            },
        })
    }

    async setTimeEnded(id) {
        try {
            await this.prisma.match.update({
                where: {
                    gameID: id,
                },
                data: {
                    end: new Date(),
                },
            })
        } catch (error) {
            console.log(error)
        }
    }

    async assignOpponnents(id, opponents) {
        try {
            await this.prisma.match.update({
                where: {
                    gameID: id,
                },
                data: {
                    opponents: {
                        create: opponents,
                    },
                },
            })
        } catch (error) {
            console.log(error)
        }
    }

    async createMatch(id) {
        try {
            await this.prisma.match.create({
                data: {
                    gameID: id,
                    start: new Date(),
                },
            })
        } catch (error) {
            console.log(error)
        }
    }
}
