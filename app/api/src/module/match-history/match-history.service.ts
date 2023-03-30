import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import _ from 'lodash'
@Injectable()
export class MatchHistoryService {
    private prisma = new PrismaClient()
    async getPlayerMatchHistory(player: string) {
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
            include: {
                opponents: {
                    include: {
                        user: true,
                    },
                },
            },
        })
        return match
    }
    async getMatchHistoryByResult(player: string, winning: boolean) {
        const match = await this.getPlayerMatchHistory(player)
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
    async getMatchHistoryBySort(player: string, sort: 'asc' | 'desc') {
        const match = await this.getPlayerMatchHistory(player)
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
