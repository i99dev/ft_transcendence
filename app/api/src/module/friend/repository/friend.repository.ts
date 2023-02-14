import { PrismaClient } from '@prisma/client'
import { NotFoundException } from '@nestjs/common'
import { UserGetDto } from './../../../module/user/dto/user.dto'

export class FriendRepository {
    constructor(private prisma: PrismaClient) {}

    async deleteFriend(name: string, login: string): Promise<UserGetDto> {
        const user = await this.prisma.user.findUnique({ where: { login: name } })
        if (!user) {
            throw new NotFoundException(`User with name ${name} was not found`)
        }
        return await this.prisma.user.update({
            where: { login: name },
            include: {
                friend_to: true,
                friends: true,
            },
            data: { friends: { disconnect: { login: login } } },
        })
    }

    async UpdateUserFriends(name: string, toAdd: string): Promise<UserGetDto> {
        let user2: UserGetDto = await this.prisma.user.findUnique({
            where: { login: toAdd },
        })
        if (!user2) {
            throw new NotFoundException(`User with name ${name} was not found`)
        }
        let user: UserGetDto = await this.prisma.user.update({
            where: { login: name },
            include: {
                friend_to: true,
                friends: true,
            },
            data: { friends: { connect: [{ id: user2.id }] } },
        })
        return user
    }
}
