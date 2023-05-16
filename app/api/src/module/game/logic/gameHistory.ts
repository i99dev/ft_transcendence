// import { MatchHistory } from '@prisma/client'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'
import { PrismaService } from '@providers/prisma/prisma.service'

export class gameHistory {
    private game: gameStatusDto

    constructor(game: gameStatusDto, private prisma: PrismaService) {
        this.game = game
        this.createGame()
    }

    public async findID(login: string): Promise<number> {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
        })
        return user.id
    }

    public IsWinner(player: PlayerDto): boolean {
        let isWinner = false
        this.game.players.forEach(pl => {
            if (pl.username !== player.username) {
                if (pl.score > player.score) {
                    isWinner = false
                } else {
                    isWinner = true
                }
            }
        })
        return isWinner
    }

    public async addHistory(): Promise<void> {
        await this.setTimeEnded()
        await this.assignOponents()
    }

    private async setTimeEnded(): Promise<void> {
        await this.prisma.match.update({
            where: {
                gameID: this.game.players[0].gameID,
            },
            data: {
                end: new Date(),
            },
        })
    }

    private async assignOponents(): Promise<void> {
        await this.prisma.match.update({
            where: {
                gameID: this.game.players[0].gameID,
            },
            data: {
                opponents: {
                    connect: await this.createOponents(),
                },
            },
        })
    }

    private async createPlayer(player: PlayerDto): Promise<number> {
        const pl = await this.prisma.player.create({
            data: {
                matches: {
                    connect: { gameID: player.gameID },
                },
                user: {
                    connect: { login: player.username },
                },
                score: player.score,
                IsWinner: this.IsWinner(player),
            },
        })
        return pl.id
    }

    private async createOponents(): Promise<any[]> {
        const players = []
        this.game.players.forEach(async player => {
            players.push({ id: await this.createPlayer(player) })
        })
        return players
    }

    public async createGame(): Promise<void> {
        if (this.game){
            await this.prisma.match.create({
                data: {
                    gameID: this.game.players[0].gameID,
                    start: new Date(),
                },
            })
        }
    }
}
