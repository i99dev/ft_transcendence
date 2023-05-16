import { PrismaClient, UserStatus } from '@prisma/client'

export class GameRepository {
    private prisma = new PrismaClient()
    public async updatePlayerStatus(status: UserStatus, login: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
        })
        if (!user) return
        await this.prisma.user.update({
            where: {
                login: login,
            },
            data: {
                status: status,
            },
        })
    }
}
