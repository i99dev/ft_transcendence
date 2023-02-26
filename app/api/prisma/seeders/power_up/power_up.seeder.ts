import { Injectable } from '@nestjs/common'
import { PowerUp, PrismaClient, User } from '@prisma/client'
import { UserSeeder } from '../user/user.seeder'

@Injectable()
export class PowerUpSeeder {
    private prisma = new PrismaClient()
    private powerUps: PowerUp[]

    async seedPowerUps(): Promise<PowerUp[]> {
        this.powerUps = [
            await this.prisma.powerUp.upsert({
                where: { type: 'sonic_ball' },
                update: {},
                create: {
                    type: 'sonic_ball',
                    period: 2,
                },
            }),
            await this.prisma.powerUp.upsert({
                where: { type: 'gomu_gomu_no' },
                update: {},
                create: {
                    type: 'gomu_gomu_no',
                    period: 2,
                },
            }),
            await this.prisma.powerUp.upsert({
                where: { type: 'bunshin_no_jutsu' },
                update: {},
                create: {
                    type: 'bunshin_no_jutsu',
                    period: 0,
                },
            }),
            await this.prisma.powerUp.upsert({
                where: { type: 'resurrection_spell' },
                update: {},
                create: {
                    type: 'resurrection_spell',
                    period: 0,
                },
            }),
        ]
        return this.powerUps
    }

    async assignPowerUpsToUsers(): Promise<User[]> {
        const users: User[] = [
            await this.prisma.user.update({
                where: { login: 'bnaji' },
                data: {
                    power_ups: {
                        connect: [{ type: 'gomu_gomu_no' }, { type: 'bunshin_no_jutsu' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'aaljaber' },
                data: {
                    power_ups: {
                        connect: [{ type: 'resurrection_spell' }],
                    },
                },
            }),
            await this.prisma.user.update({
                where: { login: 'mal-guna' },
                data: {
                    power_ups: {
                        connect: [{ type: 'gomu_gomu_no' }, { type: 'sonic_ball' }],
                    },
                },
            }),
        ]
        return users
    }
}
