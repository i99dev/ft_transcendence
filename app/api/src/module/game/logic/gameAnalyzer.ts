import { PrismaClient } from '@prisma/client'
import { MatchHistoryDto } from '../../match-history/dto/match-history.dto'

const ladderLevel = {
    CapinBoy: { name: 'Capin Boy', lowXP: 0, highXP: 100, winRate: 0 },
    Kaizoku: { name: 'Kaizoku', lowXP: 100, highXP: 300, winRate: 0.6 },
    SuperRookie: { name: 'Super Rookie', lowXP: 300, highXP: 600, winRate: 0.55 },
    Shichibukai: { name: 'Shichibukai', lowXP: 600, highXP: 1500, winRate: 0.5 },
    Yonko: { name: 'Yonko', lowXP: 1500, highXP: 3500, winRate: 0.45 },
    KaizokuOu: { name: 'Kaizoku Ou', lowXP: 3500, highXP: 6000, winRate: 0.4 },
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
            case ladderLevel.CapinBoy.name:
                xp = IsWinner ? 10 : 2
                break
            case ladderLevel.Kaizoku.name:
                xp = IsWinner ? 20 : 4
                break
            case ladderLevel.SuperRookie.name:
                xp = IsWinner ? 30 : 6
                break
            case ladderLevel.Shichibukai.name:
                xp = IsWinner ? 40 : 8
                break
            case ladderLevel.Yonko.name:
                xp = IsWinner ? 50 : 10
                break
            case ladderLevel.KaizokuOu.name:
                xp = IsWinner ? 60 : 12
                break
        }
        return xp
    }
    RankDown(ladder: string, winningrate: number): string {
        if (ladder == ladderLevel.KaizokuOu.name && winningrate < 0.4) return ladderLevel.Yonko.name
        else if (ladder == ladderLevel.Yonko.name && winningrate < 0.45)
            return ladderLevel.Shichibukai.name
        else if (ladder == ladderLevel.Shichibukai.name && winningrate < 0.5)
            return ladderLevel.SuperRookie.name
        else if (ladder == ladderLevel.SuperRookie.name && winningrate < 0.55)
            return ladderLevel.Kaizoku.name
        else if (ladder == ladderLevel.Kaizoku.name && winningrate < 0.6)
            return ladderLevel.CapinBoy.name
        return ladder
    }
    RankUp(ladder: string, xp: number, winningrate: number, totalWins: number): string {
        if (ladder == ladderLevel.Yonko.name && xp >= 3500 && winningrate >= 0.45)
            return ladderLevel.KaizokuOu.name
        else if (ladder == ladderLevel.Shichibukai.name && xp >= 1500 && winningrate >= 0.5)
            return ladderLevel.Yonko.name
        else if (ladder == ladderLevel.SuperRookie.name && xp >= 600 && winningrate >= 0.55)
            return ladderLevel.Shichibukai.name
        else if (ladder == ladderLevel.Kaizoku.name && xp >= 150 && winningrate >= 0.6)
            return ladderLevel.SuperRookie.name
        else if (ladder == ladderLevel.CapinBoy.name && totalWins >= 10)
            return ladderLevel.Kaizoku.name
        return ladder
    }
    async calcLadder(player: string): Promise<string> {
        const ladder = await this.getLadderLevel(player)
        const xp = await this.getXP(player)
        const winningrate = await this.calcWinRate(player)
        const totalWins = await this.getTotalVictories(player)
        if (
            this.RankUp(ladder, xp, winningrate, totalWins) != ladder &&
            this.RankDown(ladder, winningrate) == ladder
        )
            return await this.RankUp(ladder, xp, winningrate, totalWins)
        else if (
            this.RankUp(ladder, xp, winningrate, totalWins) == ladder &&
            this.RankDown(ladder, winningrate) != ladder
        )
            return await this.RankDown(ladder, winningrate)

        return ladder
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
