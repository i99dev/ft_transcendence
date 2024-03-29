import { Injectable } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

interface Player {
    username: string
    score: number
    isWinner: boolean
    gameId: string
}

@Injectable()
export class MatchSeeder {
    private prisma = new PrismaClient()

    private async createPlayer(player: Player): Promise<number> {
        const pl = await this.prisma.player.create({
            data: {
                matches: {
                    connect: { gameID: player.gameId },
                },
                user: {
                    connect: { username: player.username },
                },
                score: player.score,
                IsWinner: player.isWinner,
            },
        })
        return pl.id
    }

    private async createOponents(players: Player[]): Promise<any[]> {
        const opponents = []
        players.forEach(async player => {
            opponents.push({ id: await this.createPlayer(player) })
        })
        return opponents
    }

    public async createMatch(matchID: string, time: Date): Promise<void> {
        await this.prisma.match.create({
            data: {
                gameID: matchID,
                start: time,
            },
        })
    }

    public async assignOponents(matchID: string, players: Player[]): Promise<void> {
        await this.prisma.match.update({
            where: {
                gameID: matchID,
            },
            data: {
                opponents: {
                    connect: await this.createOponents(players),
                },
            },
        })
    }

    public async seedMatchHistory(): Promise<void> {
        let gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7620'
        await this.createMatch(gameid, new Date('2021-05-12T06:30:15.000Z'))
        await this.assignOponents(gameid, [
            { username: 'AJ', score: 11, isWinner: true, gameId: gameid },
            { username: 'OA', score: 4, isWinner: false, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7621'
        await this.createMatch(gameid, new Date('2022-01-31T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'AJ', score: 11, isWinner: true, gameId: gameid },
            { username: 'MA', score: 2, isWinner: false, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7622'
        await this.createMatch(gameid, new Date('2022-11-31T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'AJ', score: 11, isWinner: true, gameId: gameid },
            { username: 'BN', score: 3, isWinner: false, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7623'
        await this.createMatch(gameid, new Date('2022-12-31T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'AJ', score: 12, isWinner: true, gameId: gameid },
            { username: 'IS', score: 10, isWinner: false, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7624'
        await this.createMatch(gameid, new Date('2020-11-31T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'MA', score: 11, isWinner: true, gameId: gameid },
            { username: 'IS', score: 9, isWinner: false, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7625'
        await this.createMatch(gameid, new Date('2012-12-30T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'MA', score: 0, isWinner: false, gameId: gameid },
            { username: 'OA', score: 11, isWinner: true, gameId: gameid },
        ])
        gameid = '5a48398f-30ae-489f-b22a-4fc20e0b7626'
        await this.createMatch(gameid, new Date('2019-10-31T23:59:59.000Z'))
        await this.assignOponents(gameid, [
            { username: 'BN', score: 5, isWinner: false, gameId: gameid },
            { username: 'IS', score: 11, isWinner: true, gameId: gameid },
        ])
    }
}
