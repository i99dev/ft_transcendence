import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable()
export class BlockSeeder {
    private prisma = new PrismaService()

    async seedBlock() {
        await this.prisma.user.update({
            where: { login: 'bnaji' },
            data: {
                block_list: {
                    connect: [{ login: 'oal-tena' }],
                },
            },
        })
        await this.prisma.user.update({
            where: { login: 'isaad' },
            data: {
                block_list: {
                    connect: [
                        { login: 'bnaji' },
                        { login: 'oal-tena' },
                        { login: 'aaljaber' },
                        { login: 'mal-guna' },
                    ],
                },
            },
        })
        await this.prisma.user.update({
            where: { login: 'aaljaber' },
            data: {
                block_list: {
                    connect: [{ login: 'oal-tena' }],
                },
            },
        })
        await this.prisma.user.update({
            where: { login: 'mal-guna' },
            data: {
                block_list: {
                    connect: [{ login: 'oal-tena' }],
                },
            },
        })
        await this.prisma.user.update({
            where: { login: 'oal-tena' },
            data: {
                block_list: {
                    connect: [{ login: 'mal-guna' }],
                },
            },
        })
    }
}
