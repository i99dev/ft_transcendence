import { PrismaService } from '../../providers/prisma/prisma.service'
import { UserService } from './../user/user.service'
import { Injectable } from '@nestjs/common'
import { NotFoundException } from '@nestjs/common'
import { UserGetDto } from '@module/user/dto/user.dto'

@Injectable({})
export class FriendService {
    constructor(private prisma: PrismaService, private userService: UserService) {}

    async validateUsers(user: string, friend: string) {
        try {
            if (user) await this.userService.checkUser(await this.userService.getUser(user))
            if (friend) await this.userService.checkUser(await this.userService.getUser(friend))
        } catch (error) {
            throw new NotFoundException('User not found')
        }
    }

    async CheckFriendsUpdate(user: string, friend: string): Promise<UserGetDto> {
        try {
            await this.validateUsers(user, friend)
            return await this.UpdateUserFriends(user, friend)
        } catch (error) {
            return null
        }
    }

    async DeleteFriend(friends: string, user: string): Promise<UserGetDto> {
        try {
            await this.validateUsers(user, friends)
            if (friends) return await this.deleteFriend(user, friends)
            else return null
        } catch (error) {
            return null
        }
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
