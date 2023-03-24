import { PrismaClient } from '@prisma/client'
import { MatchHistory } from '@prisma/client'

export class gameHistory {
    private prisma = new PrismaClient()

    public async create(player1: string, player2: string): Promise<void> {
        await this.prisma.matchHistory.create({
            data: {
                opponents: {
                    connect: [{ login: player1 }, { login: player2 }],
                },
                winnerID: 3,
                at: new Date(),
                score: [10, 1],
            },
        })
    }
    public async addHistory(player1: string, player2: string): Promise<void> {
        await this.create(player1, player2)
    }
}
