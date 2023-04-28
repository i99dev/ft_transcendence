import { Injectable } from '@nestjs/common'
import { Achievement, PrismaClient, User } from '@prisma/client'

@Injectable()
export class AchievementSeeder {
    private prisma = new PrismaClient()
    private achievements: Achievement[]

    async seedAchievements(): Promise<Achievement[]> {
        this.achievements = [
            await this.prisma.achievement.upsert({
                where: { type: 'Serial Killer' },
                update: {},
                create: {
                    type: 'Serial Killer',
                    description: 'Winning 11 matches in a row',
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Rookie no more' },
                update: {},
                create: {
                    type: 'Rookie no more',
                    description: 'Winning two games in a row in the first level',
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'First blood' },
                update: {},
                create: {
                    type: 'First blood',
                    description: 'Winning  first game',
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'No Sweat' },
                update: {},
                create: {
                    type: 'No Sweat',
                    description: 'Winning game without the opponent scoring any points',
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Paddle Samurai' },
                update: {},
                create: {
                    type: 'Paddle Samurai',
                    description: `Blocking a certain number of opponent's shots`,
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Table Ninja' },
                update: {},
                create: {
                    type: 'Table Ninja',
                    description:
                        'Hitting a certain number of shots that bounce off multiple edges of the table',
                    image: `../../assets/devilfruit.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Ball Whisperer' },
                update: {},
                create: {
                    type: 'Ball Whisperer',
                    description:
                        'Hitting a certain number of shots that land just inside the edge of the table',
                    image: `../../assets/devilfruit.png`,
                },
            }),
        ]
        return this.achievements
    }

    async assignAchievementsToUsers(): Promise<User[]> {
        const users: User[] = [
            await this.prisma.user.update({
                where: { login: 'bnaji' },
                data: {
                    achievements: {
                        connect: [{ type: 'Ball Whisperer' }, { type: 'Paddle Samurai' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'isaad' },
                data: {
                    achievements: {
                        connect: [{ type: 'Ball Whisperer' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'aaljaber' },
                data: {
                    achievements: {
                        connect: [
                            { type: 'Table Ninja' },
                            { type: 'Paddle Samurai' },
                            { type: 'No Sweat' },
                        ],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'mal-guna' },
                data: {
                    achievements: {
                        connect: [{ type: 'Table Ninja' }, { type: 'Paddle Samurai' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'oal-tena' },
                data: {
                    achievements: {
                        connect: [{ type: 'No Sweat' }],
                    },
                },
            }),
        ]
        return users
    }
}
