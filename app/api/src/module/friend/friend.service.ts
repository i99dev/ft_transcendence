import { PrismaService } from '../../providers/prisma/prisma.service'
import { UserService } from './../user/user.service'
import { Injectable } from '@nestjs/common'
import { FriendRepository } from './repository/friend.repository'
import { NotFoundException } from '@nestjs/common'
import { UserGetDto } from '@module/user/dto/user.dto'

@Injectable({})
export class FriendService {
    constructor(private repository: FriendRepository, private prisma: PrismaService, private userService: UserService) {}

    async validateUsers(user: string, friend: string) {
        try {
            if (user) await this.userService.checkUser(await this.userService.getUser(user))
            if (friend) await this.userService.checkUser(await this.userService.getUser(friend))
        } catch (error) {
            throw new NotFoundException('User not found')
        }
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
            throw new NotFoundException(`User ${login} does not exist`)
        }
        const commonFriends: UserGetDto[] = user.friend_to.filter(friend =>
            user.friends.some(f => f.id === friend.id),
        )
        return commonFriends
    }

    async checkAddedFriends(login: string, friend: string): Promise<boolean> {
        const user: UserGetDto = await this.prisma.user.findUnique({
            where: {
                login: login,
            },
            include: {
                friends: true,
            },
        })
        if (!user) {
            throw new NotFoundException(`User ${login} does not exist`)
        }
        return user.friends.some(f => f.login === friend)
    }
}
