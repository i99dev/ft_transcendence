import { PrismaClient } from '@prisma/client'
import { MatchHistoryDto } from '../../match-history/dto/match-history.dto'

enum ladderLevel {
    CapinBoy = 'Capin Boy',
    Kaizoku = 'Kaizoku',
    SuperRookie = 'Super Rookie',
    Shichibukai = 'Shichibukai',
    Yonko = 'Yonko',
    KaizokuOu = 'Kaizoku Ou',
}

export class gameAnalyzer {
    private prisma = new PrismaClient()
    async getTotalVictories(player: string): Promise<number> {
        return await this.prisma.match.count({
            where: {
                opponents: {
                    some: {
                        user: {
                            login: player,
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
                            login: player,
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
                            login: player,
                        },
                    },
                },
            },
        })
    }
    async getWinRate(player: string): Promise<number> {
        const totalWins = await this.getTotalVictories(player)
        const totalMatches = await this.getTotalMatches(player)
        return totalWins / totalMatches
    }
    async getVictories(player: string): Promise<MatchHistoryDto[]> {
        return await this.prisma.match.findMany({
            where: {
                opponents: {
                    some: {
                        user: {
                            login: player,
                        },
                        IsWinner: true,
                    },
                },
            },
        })
    }
    async getDefeats(player: string): Promise<MatchHistoryDto[]> {
        return await this.prisma.match.findMany({
            where: {
                opponents: {
                    some: {
                        user: {
                            login: player,
                        },
                        IsWinner: false,
                    },
                },
            },
        })
    }
    async getAcheivment(player: string): Promise<string> {
        const totalWins = await this.getTotalVictories(player)
        if (totalWins == 1) return 'Rookie no more'
    }
    async getLadderLevel(player: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: player,
            },
        })
        return user.ladder
    }
    async getXP(player: string, IsWinner: boolean): Promise<number> {
        const ladder = await this.getLadderLevel(player)
        let xp = 0
        switch (ladder) {
            case ladderLevel.CapinBoy:
                if (IsWinner) xp = 10
                else xp = 2
                break
            case ladderLevel.Kaizoku:
                if (IsWinner) xp = 20
                else xp = 4
                break
            case ladderLevel.SuperRookie:
                if (IsWinner) xp = 30
                else xp = 6
                break
            case ladderLevel.Shichibukai:
                if (IsWinner) xp = 40
                else xp = 8
                break
            case ladderLevel.Yonko:
                if (IsWinner) xp = 50
                else xp = 10
                break
            case ladderLevel.KaizokuOu:
                if (IsWinner) xp = 60
                else xp = 12
                break
        }
        return xp
    }
}
