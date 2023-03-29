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
            if (m.opponents[0].user.login === player) {
                if (m.opponents[0].IsWinner === winning) {
                    winningMatch.push(m)
                }
            } else {
                if (m.opponents[1].IsWinner === winning) {
                    winningMatch.push(m)
                }
            }
        })
        return winningMatch
    }
}
