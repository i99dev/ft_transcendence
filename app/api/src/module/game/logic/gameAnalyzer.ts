import { MatchService } from '@module/match/match.service'
import { ConnectedUser } from '../interface/game.interface'
import { NotificationService } from '@module/notification/notification.service'
import { NotificationType } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { UserService } from '@module/user/user.service'
import { AchievementService } from '@module/achievement/achievement.service'

const ladderLevel = {
    CapinBoy: { Rank: 6, lowXP: 0, highXP: 100, winRate: 0 },
    Kaizoku: { Rank: 5, lowXP: 100, highXP: 300, winRate: 0.6 },
    SuperRookie: { Rank: 4, lowXP: 300, highXP: 600, winRate: 0.55 },
    Shichibukai: { Rank: 3, lowXP: 600, highXP: 1500, winRate: 0.5 },
    Yonko: { Rank: 2, lowXP: 1500, highXP: 3500, winRate: 0.45 },
    KaizokuOu: { Rank: 1, lowXP: 3500, highXP: 6000, winRate: 0.4 },
}

@Injectable()
export class gameAnalyzer {
    constructor(
        private matchService: MatchService,
        private notificationService: NotificationService,
        private userService: UserService,
        private achievementService: AchievementService,
    ) {}

    // Data retrievals
    async getLadderLevel(login: string): Promise<number> {
        const user = await this.userService.getUser(login)
        return user.ladder
    }

    async getXP(login: string): Promise<number> {
        const user = await this.userService.getUser(login)
        return user.xp
    }

    // Rank calculations
    async calcWinRate(login: string): Promise<number> {
        const totalWins = await this.matchService.getTotalVictories(login)
        const totalMatches = await this.matchService.getTotalMatches(login)
        return totalWins / totalMatches
    }

    async calcXP(login: string, IsWinner: boolean): Promise<number> {
        const ladder = await this.getLadderLevel(login)
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

    async calcLadder(login: string): Promise<number> {
        const ladder = await this.getLadderLevel(login)
        const xp = await this.getXP(login)
        const winningrate = await this.calcWinRate(login)
        const totalWins = await this.matchService.getTotalVictories(login)
        if (
            this.RankUp(ladder, xp, winningrate, totalWins) != ladder &&
            this.RankDown(ladder, winningrate) == ladder
        ) {
            await this.storeRankingAsNotification(
                login,
                this.RankUp(ladder, xp, winningrate, totalWins),
                true,
            )
            return this.RankUp(ladder, xp, winningrate, totalWins)
        } else if (
            this.RankUp(ladder, xp, winningrate, totalWins) == ladder &&
            this.RankDown(ladder, winningrate) != ladder
        ) {
            await this.storeRankingAsNotification(login, this.RankDown(ladder, winningrate), false)
            return this.RankDown(ladder, winningrate)
        }

        return ladder
    }

    // Update Data
    async updatePlayerXP(login: string, IsWinner: boolean): Promise<void> {
        await this.userService.updatePlayerXP(login, await this.calcXP(login, IsWinner))
    }

    async deductPlayerXP(login: string): Promise<number> {
        const currentXP = (await this.userService.getUser(login)).xp
        return Math.round(currentXP - currentXP * 0.2)
    }

    async increasePlayerXP(login: string): Promise<number> {
        const currentXP = (await this.userService.getUser(login)).xp
        return Math.round(currentXP + currentXP * 0.2)
    }

    async paunishPlayer(login: string): Promise<void> {
        const newXP = await this.deductPlayerXP(login)
        await this.userService.updateUser(
            {
                xp: newXP,
            },
            login,
        )
        await this.notificationService.createNotification({
            user_login: login,
            content: newXP.toString(),
            type: NotificationType.PUNISHMENT,
            target: 'test',
        })
    }

    async compensatePlayer(login: string): Promise<void> {
        const newXP = await this.increasePlayerXP(login)
        await this.userService.updateUser(
            {
                xp: newXP,
            },
            login,
        )
        await this.notificationService.createNotification({
            user_login: login,
            content: newXP.toString(),
            type: NotificationType.COMPENSATION,
            target: 'test',
        })
    }

    async updatePlayerLadder(login: string): Promise<void> {
        await this.userService.updateUser(
            {
                ladder: await this.calcLadder(login),
            },
            login,
        )
    }

    async updatePlayerAcheivments(login: string, achievement: string): Promise<void> {
        const ach = await this.achievementService.getAchievementType(achievement)

        if (ach == null) return
        await this.achievementService.addAchievement(login, ach)
    }

    async updatePlayerWinningRate(login: string): Promise<void> {
        const winRate = await this.calcWinRate(login)
        try {
            await this.userService.updateUser(
                {
                    wr: winRate,
                },
                login,
            )
        } catch (error) {
            console.log(error)
        }
    }

    async calcWinStreak(login: string, winNum: number): Promise<number> {
        const matches = await this.matchService.getMatches(login)
        let winStreak = 0
        for (let i = 0; i < matches.length; i++) {
            for (let j = 0; j < matches[i].opponents.length; j++) {
                if (matches[i].opponents[j].user.login == login) {
                    if (matches[i].opponents[j].IsWinner) {
                        winStreak++
                    } else {
                        return winStreak >= winNum ? winStreak : 0
                    }
                }
            }
        }
        return winStreak
    }

    async checkNoSweatAchievement(login: string): Promise<boolean> {
        const matches = await this.matchService.getPlayerMatchHistory(1, login)
        const lastMatch = matches ? matches[0] : null

        if (lastMatch && lastMatch.opponents[0].user && lastMatch.opponents[1].user) {
            if (
                (lastMatch.opponents[0].user.login == login &&
                    lastMatch.opponents[0].IsWinner &&
                    lastMatch.opponents[0].score === 11 &&
                    lastMatch.opponents[1].score === 0) ||
                (lastMatch.opponents[1].user.login == login &&
                    lastMatch.opponents[1].IsWinner &&
                    lastMatch.opponents[1].score === 11 &&
                    lastMatch.opponents[0].score === 0)
            )
                return true
        }
        return false
    }

    async checkIfAchievementExists(login: string, achievement: string): Promise<boolean> {
        const count = await this.achievementService.checkPlayerAchievements(login, achievement)
        if (count > 0) return true
        return false
    }

    async grantAchievements(login: string): Promise<string[]> {
        const totalAcheivments = []
        const totalWins = await this.matchService.getTotalVictories(login)
        const ladder = await this.getLadderLevel(login)
        if (totalWins == 1) totalAcheivments.push('First Blood')
        if (ladder == ladderLevel.CapinBoy.Rank && (await this.calcWinStreak(login, 2)) == 2)
            totalAcheivments.push('Rookie no more')
        if ((await this.calcWinStreak(login, 11)) == 11) totalAcheivments.push('Serial Killer')
        if (await this.checkNoSweatAchievement(login)) totalAcheivments.push('No Sweat')
        return totalAcheivments
    }

    async assignAcheivments(login: string, achievements: string[]): Promise<void> {
        if (achievements.length == 0) return
        achievements.forEach(async achievement => {
            if (!(await this.checkIfAchievementExists(login, achievement))) {
                await this.updatePlayerAcheivments(login, achievement)
                await this.storeAchievementAsNotification(login, achievement)
            }
        })
    }

    async storeAchievementAsNotification(login: string, achievement: string): Promise<void> {
        await this.notificationService.createNotification({
            user_login: login,
            content: achievement,
            type: NotificationType.ACHIEVEMENT,
            target: 'test',
        })
    }

    async storeRankingAsNotification(login: string, rank: number, newRank: boolean): Promise<void> {
        await this.notificationService.createNotification({
            user_login: login,
            content: rank.toString(),
            type: newRank ? NotificationType.RANK_UP : NotificationType.RANK_DOWN,
            target: 'test',
        })
    }

    announceAcheivment(users: ConnectedUser[], login: string, achievements: string[]): void {
        users.forEach(user => {
            if (user.login == login) {
                user.socket.emit('achievement', achievements)
            }
        })
    }
}
