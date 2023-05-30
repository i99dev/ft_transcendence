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
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/Rogue3.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Rookie no more' },
                update: {},
                create: {
                    type: 'Rookie no more',
                    description: 'Winning two games in a row in the first level',
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/UI_Skill_Icon_Dash.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'First Blood' },
                update: {},
                create: {
                    type: 'First Blood',
                    description: 'Winning  first game',
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/UI_Skill_Icon_Claw.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'No Sweat' },
                update: {},
                create: {
                    type: 'No Sweat',
                    description: 'Winning game without the opponent scoring any points',
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/Medium10.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Paddle Samurai' },
                update: {},
                create: {
                    type: 'Paddle Samurai',
                    description: `Blocking a certain number of opponent's shots`,
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/Electromancer16.png`,
                },
            }),
            await this.prisma.achievement.upsert({
                where: { type: 'Ball Whisperer' },
                update: {},
                create: {
                    type: 'Ball Whisperer',
                    description:
                        'Hitting a certain number of shots that land just inside the edge of the table',
                    image: `https://gamefresco1.s3.amazonaws.com/2022/11/Arcanist15.png`,
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
                        connect: [{ type: 'Ball Whisperer' }, { type: 'First Blood' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'aaljaber' },
                data: {
                    achievements: {
                        connect: [{ type: 'Paddle Samurai' }, { type: 'First Blood' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'mal-guna' },
                data: {
                    achievements: {
                        connect: [{ type: 'Paddle Samurai' }, { type: 'First Blood' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'oal-tena' },
                data: {
                    achievements: {
                        connect: [{ type: 'No Sweat' }, { type: 'First Blood' }],
                    },
                },
            }),
        ]
        return users
    }
}
