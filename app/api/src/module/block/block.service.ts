import { Injectable } from "@nestjs/common";
import { PrismaService } from "@providers/prisma/prisma.service";


@Injectable()
export class BlockService {
    constructor(private prisma: PrismaService) {}

    async checkBlock(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.findUnique({
                where: {
                    login: user_login
                },
                select: {
                    block_list: {
                        where: {
                            login: blocked_user_login
                        }
                    }
                }
            })
            if (block.block_list.length > 0)
                return true
            return false
        }
        catch (error) {
            console.log(error)
        }
    }

    async getBlockList(user_login: string) {
        try {
            const blockList = await this.prisma.user.findUnique({
                where: {
                    login: user_login
                },
                select: {
                    block_list: true,
                },
            })
            return blockList
        }
        catch (error) {
            console.log(error)
        }
    }

    async blockUser(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.update({
                where: {
                    login: user_login
                },
                data: {
                    block_list: {
                        connect: {
                            login: blocked_user_login
                        }
                    }
                }
            })
            return block
        }
        catch (error) {
            console.log(error)
        }
    }

    async unblockUser(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.update({
                where: {
                    login: user_login
                },
                data: {
                    block_list: {
                        disconnect: {
                            login: blocked_user_login
                        }
                    }
                }
            })
            return block
        }
        catch (error) {
            console.log(error)
        }
    }

    async autoBlock(user_login: string, blocked_user_login: string) {
        if (await this.checkBlock(user_login, blocked_user_login))
            return null
        await this.blockUser(user_login, blocked_user_login)
    }

    async autoUnblock(user_login: string, blocked_user_login: string) {
        if (!await this.checkBlock(user_login, blocked_user_login))
            return null
        await this.unblockUser(user_login, blocked_user_login)
    }
}