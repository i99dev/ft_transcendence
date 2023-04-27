import { PrismaClient } from '@prisma/client'
import { MatchHistoryDto, PlayerDto } from '../../match-history/dto/match-history.dto'

const ladderLevel = {
    CapinBoy: { Rank: 6, lowXP: 0, highXP: 100, winRate: 0 },
    Kaizoku: { Rank: 5, lowXP: 100, highXP: 300, winRate: 0.6 },
    SuperRookie: { Rank: 4, lowXP: 300, highXP: 600, winRate: 0.55 },
    Shichibukai: { Rank: 3, lowXP: 600, highXP: 1500, winRate: 0.5 },
    Yonko: { Rank: 2, lowXP: 1500, highXP: 3500, winRate: 0.45 },
    KaizokuOu: { Rank: 1, lowXP: 3500, highXP: 6000, winRate: 0.4 },
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
    async getMatches(player: string): Promise<MatchHistoryDto[]> {
        return await this.prisma.match.findMany({
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
    async getLadderLevel(player: string): Promise<number> {
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
            case ladderLevel.CapinBoy.Rank:
                xp = IsWinner ? 10 : 2
                break
            case ladderLevel.Kaizoku.Rank:
                xp = IsWinner ? 20 : 4
                break
            case ladderLevel.SuperRookie.Rank:
                xp = IsWinner ? 30 : 6
                break
            case ladderLevel.Shichibukai.Rank:
                xp = IsWinner ? 40 : 8
                break
            case ladderLevel.Yonko.Rank:
                xp = IsWinner ? 50 : 10
                break
            case ladderLevel.KaizokuOu.Rank:
                xp = IsWinner ? 60 : 12
                break
        }
        return xp
    }
    RankDown(ladder: number, winningrate: number): number {
        if (ladder == ladderLevel.KaizokuOu.Rank && winningrate < 0.4) return ladderLevel.Yonko.Rank
        else if (ladder == ladderLevel.Yonko.Rank && winningrate < 0.45)
            return ladderLevel.Shichibukai.Rank
        else if (ladder == ladderLevel.Shichibukai.Rank && winningrate < 0.5)
            return ladderLevel.SuperRookie.Rank
        else if (ladder == ladderLevel.SuperRookie.Rank && winningrate < 0.55)
            return ladderLevel.Kaizoku.Rank
        else if (ladder == ladderLevel.Kaizoku.Rank && winningrate < 0.6)
            return ladderLevel.CapinBoy.Rank
        return ladder
    }
    RankUp(ladder: number, xp: number, winningrate: number, totalWins: number): number {
        if (ladder == ladderLevel.Yonko.Rank && xp >= 3500 && winningrate >= 0.45)
            return ladderLevel.KaizokuOu.Rank
        else if (ladder == ladderLevel.Shichibukai.Rank && xp >= 1500 && winningrate >= 0.5)
            return ladderLevel.Yonko.Rank
        else if (ladder == ladderLevel.SuperRookie.Rank && xp >= 600 && winningrate >= 0.55)
            return ladderLevel.Shichibukai.Rank
        else if (ladder == ladderLevel.Kaizoku.Rank && xp >= 150 && winningrate >= 0.6)
            return ladderLevel.SuperRookie.Rank
        else if (ladder == ladderLevel.CapinBoy.Rank && totalWins >= 10)
            return ladderLevel.Kaizoku.Rank
        return ladder
    }
    async calcLadder(player: string): Promise<number> {
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

    // Update Data
    async updatePlayerXP(player: string, IsWinner: boolean): Promise<void> {
        await this.prisma.user.update({
            where: {
                login: player,
            },
            data: {
                xp: {
                    increment: await this.calcXP(player, IsWinner),
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
    async updatePlayerAcheivments(player: string, acheivment: string): Promise<void> {
        this.prisma.user.update({
            where: {
                login: player,
            },
            data: {
                achievements: {
                    connect: {
                        type: acheivment,
                    },
                },
            },
        })
    }

    async calcWinStreak(player: string, winNum: number): Promise<number> {
        const matches = await this.getMatches(player)
        console.log(
            'matches',
            matches[0].opponents[0].user.login,
            matches[0].opponents[1].user.login,
        )
        let winStreak = 0
        for (let i = 0; i < matches.length; i++) {
            for (let j = 0; j < matches[i].opponents.length; j++) {
                if (matches[i].opponents[j].user.login == player) {
                    if (matches[i].opponents[j].IsWinner) winStreak++
                    else {
                        console.log('winstreak re', winStreak)
                        return winStreak >= winNum ? winStreak : 0
                    }
                }
            }
        }
        console.log('winstreak', winStreak)
        return winStreak
    }

    async checkIfAcheivmentExists(player: string, acheivment: string): Promise<boolean> {
        const count = await this.prisma.user.count({
            where: {
                login: player,
                achievements: {
                    some: {
                        type: acheivment,
                    },
                },
            },
        })
        if (count > 0) return true
        return false
    }

    // Acheivments
    async assignAcheivment(player: string): Promise<string[]> {
        const totalAcheivments = []
        const totalWins = await this.getTotalVictories(player)
        const ladder = await this.getLadderLevel(player)
        console.log('ladder', ladder, ladderLevel.CapinBoy.Rank)
        if (!this.checkIfAcheivmentExists(player, 'First Blood') && totalWins == 1)
            totalAcheivments.push('First Blood')
        if (
            !this.checkIfAcheivmentExists(player, 'Rookie no more') &&
            ladder == ladderLevel.Yonko.Rank &&
            (await this.calcWinStreak(player, 2)) == 2
        )
            totalAcheivments.push('Rookie no more')
        if (
            !this.checkIfAcheivmentExists(player, 'Serial Killer') &&
            (await this.calcWinStreak(player, 11)) == 11
        )
            totalAcheivments.push('Serial Killer')
        return totalAcheivments
    }

    async grantAcheivments(login: string, acheivments: string[]): Promise<void> {
        if (acheivments.length == 0) return
        acheivments.forEach(async acheivment => {
            await this.updatePlayerAcheivments(login, acheivment)
        })
    }
}
