import { PrismaClient } from '@prisma/client'
// import { MatchHistory } from '@prisma/client'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'

export class gameHistory {
    private prisma = new PrismaClient()

    public async findID(login: string): Promise<number> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
        })
        return user.id
    }

    private findWinner(game: gameStatusDto): PlayerDto {
        return game.players[0].score > game.players[1].score ? game.players[0] : game.players[1]
    }

    // public async create(game: gameStatusDto): Promise<void> {
    //     await this.prisma.matchHistory.create({
    //         data: {
    //             opponents: {
    //                 connect: [
    //                     { login: game.players[0].username },
    //                     { login: game.players[1].username },
    //                 ],x
    //             },
    //             winnerID: await this.findID(this.findWinner(game).username),
    //             at: new Date(),
    //             score: [game.players[0].score, game.players[1].score],
    //         },
    //     })
    // }
    // public async addHistory(game: gameStatusDto): Promise<void> {
    //     await this.create(game)
    // }
}
