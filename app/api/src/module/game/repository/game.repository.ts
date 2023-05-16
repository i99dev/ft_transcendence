import { UserStatus } from '@prisma/client'
import { PrismaService } from '@providers/prisma/prisma.service'

export class GameRepository {
    private prisma = new PrismaService()
    public async updatePlayerStatus(status: UserStatus, login: string) {
        const user = await this.prisma.user.update({
            where: {
                login: login,
            },
            data: {
                status: status,
            },
        })
    }
}
