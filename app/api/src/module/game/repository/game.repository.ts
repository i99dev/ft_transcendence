import { PrismaClient, UserStatus } from "@prisma/client";

export class GameRepository {
    private prisma = new PrismaClient()
    public async updatePlayerStatus(status: UserStatus, login: string) {
        console.log("UPDATE PLAYER STATUS", status, login)
        const user = await this.prisma.user.update({
            where: {
                login: login
            },
            data: {
                status: status
            }
        })
    }
}
