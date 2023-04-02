import { PrismaClient } from '@prisma/client'
import { NotFoundException } from '@nestjs/common'
import { UserGetDto } from '../../user/dto/user.dto'

export class FriendRepository {
    prisma = new PrismaClient()

    async deleteFriend(name: string, login: string): Promise<UserGetDto> {
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
        const user2: UserGetDto = await this.prisma.user.findUnique({
            where: { login: toAdd },
        })
        if (!user2) {
            throw new NotFoundException(`User with name ${name} was not found`)
        }
        const user: UserGetDto = await this.prisma.user.update({
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
