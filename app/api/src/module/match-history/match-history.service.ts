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

        const winningMatches = _.filter(match, m => {
            const playerOpponent = _.find(m.opponents, { user: { login: player } })
            return playerOpponent && playerOpponent.isWinning
        })
        return winningMatches
    }
}
