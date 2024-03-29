import { FriendWsService } from '@module/friend/gateway/friendWs.service'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'

@Injectable()
export class BlockService {
    constructor(private prisma: PrismaService, private friendWsService: FriendWsService) {}

    async validateUser(user_login: string) {
        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    login: user_login,
                },
            })
            if (!user) return false
            return true
        } catch (error) {
            console.log(error)
        }
    }

    async checkBlock(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.findUnique({
                where: {
                    login: user_login,
                },
                select: {
                    block_list: {
                        where: {
                            login: blocked_user_login,
                        },
                    },
                },
            })
            if (!block) return false
            if (block.block_list.length > 0) return true
            return false
        } catch (error) {
            console.log(error)
        }
    }

    async getBlockList(user_login: string) {
        try {
            const blockList = await this.prisma.user.findUnique({
                where: {
                    login: user_login,
                },
                select: {
                    block_list: true,
                },
            })
            return blockList?.block_list
        } catch (error) {
            console.log(error)
        }
    }

    async blockUser(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.update({
                where: {
                    login: user_login,
                },
                data: {
                    block_list: {
                        connect: {
                            login: blocked_user_login,
                        },
                    },
                },
            })
            return block
        } catch (error) {
            console.log(error)
        }
    }

    async unblockUser(user_login: string, blocked_user_login: string) {
        try {
            const block = await this.prisma.user.update({
                where: {
                    login: user_login,
                },
                data: {
                    block_list: {
                        disconnect: {
                            login: blocked_user_login,
                        },
                    },
                },
            })
            return block
        } catch (error) {
            console.log(error)
        }
    }

    async autoBlock(user_login: string, blocked_user_login: string) {
        if (
            !(await this.validateUser(user_login)) ||
            !(await this.validateUser(blocked_user_login))
        )
            return null
        if (await this.checkBlock(user_login, blocked_user_login)) return null
        if (!(await this.friendWsService.deleteFriend(user_login, blocked_user_login))) return null
        return await this.blockUser(user_login, blocked_user_login)
    }

    async autoUnblock(user_login: string, blocked_user_login: string) {
        if (
            !(await this.validateUser(user_login)) ||
            !(await this.validateUser(blocked_user_login))
        )
            return null
        if (!(await this.checkBlock(user_login, blocked_user_login))) return null
        return await this.unblockUser(user_login, blocked_user_login)
    }

    async checkIfAvailableFromBlock(user_login: string, blocked_user_login: string) {
        if (await this.checkBlock(user_login, blocked_user_login)) return false
        if (await this.checkBlock(blocked_user_login, user_login)) return false
        return true
    }
}
