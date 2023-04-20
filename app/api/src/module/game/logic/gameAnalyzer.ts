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

    // Data retrievals
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
    async getLadderLevel(player: string): Promise<string> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: player,
            },
        })
        return user.ladder
    }
    async getXP(player: string): Promise<number> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: player,
            },
        })
        return user.xp
    }

    // Rank calculations
    async calcWinRate(player: string): Promise<number> {
        const totalWins = await this.getTotalVictories(player)
        const totalMatches = await this.getTotalMatches(player)
        return totalWins / totalMatches
    }
    async calcXP(player: string, IsWinner: boolean): Promise<number> {
        const ladder = await this.getLadderLevel(player)
        let xp = 0
        switch (ladder) {
            case ladderLevel.CapinBoy:
                xp = IsWinner ? 10 : 2
                break
            case ladderLevel.Kaizoku:
                xp = IsWinner ? 20 : 4
                break
            case ladderLevel.SuperRookie:
                xp = IsWinner ? 30 : 6
                break
            case ladderLevel.Shichibukai:
                xp = IsWinner ? 40 : 8
                break
            case ladderLevel.Yonko:
                xp = IsWinner ? 50 : 10
                break
            case ladderLevel.KaizokuOu:
                xp = IsWinner ? 60 : 12
                break
        }
        return xp
    }
    async calcLadder(player: string): Promise<string> {
        if (
            (await this.getLadderLevel(player)) == ladderLevel.Yonko &&
            (await this.getXP(player)) >= 3500 &&
            (await this.calcWinRate(player)) >= 0.45
        )
            return ladderLevel.KaizokuOu
        else if (
            (await this.getLadderLevel(player)) == ladderLevel.Shichibukai &&
            (await this.getXP(player)) >= 1500 &&
            (await this.calcWinRate(player)) >= 0.5
        )
            return ladderLevel.Yonko
        else if (
            (await this.getLadderLevel(player)) == ladderLevel.SuperRookie &&
            ((await this.getXP(player)) >= 600 || (await this.calcWinRate(player)) >= 0.55)
        )
            return ladderLevel.Shichibukai
        else if (
            (await this.getLadderLevel(player)) == ladderLevel.Kaizoku &&
            (await this.getXP(player)) >= 150 &&
            (await this.calcWinRate(player)) >= 0.6
        )
            return ladderLevel.SuperRookie
        else if (
            (await this.getLadderLevel(player)) == ladderLevel.CapinBoy &&
            (await this.getTotalVictories(player)) >= 10
        )
            return ladderLevel.Kaizoku
        return await this.getLadderLevel(player)
    }
    async updatePlayerXP(player: string): Promise<void> {
        await this.prisma.user.update({
            where: {
                login: player,
            },
            data: {
                xp: {
                    increment: await this.calcXP(player, true),
                },
            },
        })
    }
    async updatePlayerLadder(player: string): Promise<void> {
        await this.prisma.user.update({
            where: {
                login: player,
            },
            data: {
                ladder: await this.calcLadder(player),
            },
        })
    }

    // Acheivments
    async assignAcheivment(player: string): Promise<string> {
        const totalWins = await this.getTotalVictories(player)
        if (totalWins == 1) return 'Rookie no more'
    }
}
