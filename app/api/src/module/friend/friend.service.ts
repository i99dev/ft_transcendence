import { UserService } from './../user/user.service'
import { PrismaClient } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { FriendRepository } from './repository/friend.repository'
import { UserGetDto } from './dto/friend.dto'
import { NotFoundException } from '@nestjs/common'
import { UserRepository } from '../user/repository/user.repository'

@Injectable({})
export class FriendService {
    constructor(private repository: FriendRepository) {}
    userService = new UserService(new UserRepository())
    prisma = new PrismaClient()

    async validateUsers(user: string, friend: string) {
        if (user) await this.userService.checkUser(this.userService.getUser(user))
        if (friend) await this.userService.checkUser(this.userService.getUser(friend))
    }

    async CheckFriendsUpdate(user: string, friend: string): Promise<UserGetDto> {
        await this.validateUsers(user, friend)
        return await this.repository.UpdateUserFriends(user, friend)
    }

    async DeleteFriend(friends: string, user: string): Promise<UserGetDto> {
        await this.validateUsers(user, friends)
        if (friends) return this.repository.deleteFriend(user, friends)
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
        if (!user) {
            throw new NotFoundException(`User ${name} does not exist`)
        }
        const commonFriends: UserGetDto[] = user.friend_to.filter(friend =>
            user.friends.some(f => f.id === friend.id),
        )
        return commonFriends
    }
}
