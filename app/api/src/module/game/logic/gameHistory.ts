import { PrismaService } from '@providers/prisma/prisma.service'
import { gameStatusDto, PlayerDto } from '../dto/game.dto'
import { Injectable } from '@nestjs/common'
import { UserService } from '@module/user/user.service'
import { MatchService } from '@module/match/match.service'

@Injectable()
export class gameHistory {
    constructor(
        private game: gameStatusDto,
        private prisma: PrismaService,
        private userService: UserService,
        private matchService: MatchService,
    ) {
        this.createGame()
    }

    public async findID(login: string): Promise<number> {
        const user = await this.userService.getUser(login)
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
        await this.matchService.setTimeEnded(this.game.players[0].gameID)
    }

    private async assignOponents(): Promise<void> {
        await this.matchService.assignOpponnents(
            this.game.players[0].gameID,
            await this.createOponents(),
        )
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
        await this.matchService.createMatch(this.game.players[0].gameID)
    }
}
