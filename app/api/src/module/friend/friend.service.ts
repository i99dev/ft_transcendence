import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FriendRepository } from './repository/friend.repository'
import { UserGetDto } from './dto/friend.dto'

@Injectable({})
export class FriendService {

    constructor(private repository: FriendRepository, private prisma: PrismaClient) {}

    async getUser(name: string): Promise<UserGetDto> {
        const user: UserGetDto = await this.prisma.user.findUnique({
            where: { login: name },
            include: {
                friend_to: true,
                friends: true,
            },
        })
        return user
    }

    async CheckFriendsUpdate(friend: string, name: string): Promise<void> {
        if (friend) {
            await this.repository.UpdateUserFriends(name, friend)
        }
    }

    async DeleteFriend(friends: string, name: string): Promise<UserGetDto> {
        if (friends) return this.repository.deleteFriend(name, friends)
    }

    async getFriends(login: string): Promise<UserGetDto[]> {
        const user: UserGetDto = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
            include: {
                friends: true,
                friend_to: true,
            },
        })
        const commonFriends: UserGetDto[] = user.friend_to.filter(friend =>
            user.friends.some(f => f.id === friend.id),
        )
        return commonFriends
    }
}
