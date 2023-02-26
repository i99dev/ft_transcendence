import { Injectable } from '@nestjs/common'
import { Achievement, PrismaClient, User } from '@prisma/client'

@Injectable()
export class AchievementSeeder {
    private prisma = new PrismaClient()
    private achievements: Achievement[]

    async seedAchievements(): Promise<Achievement[]> {
        this.achievements = [
            await this.prisma.achievement.upsert({
                where: { type: 'points_hunter' },
                update: {},
                create: {
                    type: 'points_hunter',
                    description: 'Collect 50 points in one day.',
                    points: 10,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'serial_killer' },
                update: {},
                create: {
                    type: 'serial_killer',
                    description: 'Win 10 games in row.',
                    points: 7,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'steel_defender' },
                update: {},
                create: {
                    type: 'steel_defender',
                    description: 'Win 2 games in row without losing a point.',
                    points: 5,
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
                        connect: [
                            { type: 'points_hunter' },
                            { type: 'serial_killer' },
                            { type: 'steel_defender' },
                        ],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'isaad' },
                data: {
                    achievements: {
                        connect: [{ type: 'steel_defender' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'aaljaber' },
                data: {
                    achievements: {
                        connect: [{ type: 'points_hunter' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'mal-guna' },
                data: {
                    achievements: {
                        connect: [{ type: 'points_hunter' }, { type: 'serial_killer' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'oal-tena' },
                data: {
                    achievements: {
                        connect: [{ type: 'serial_killer' }],
                    },
                },
            }),
        ]
        return users
    }
}
