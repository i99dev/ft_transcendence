import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
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
}
