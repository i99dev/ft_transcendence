import { JwtService } from '@nestjs/jwt';
import { Injectable } from "@nestjs/common";
import { FriendService } from "../friend.service";
import { PrismaClient } from '@prisma/client';


@Injectable()
export class FriendWsService {
    constructor(private friendService: FriendService, private prisma: PrismaClient, private jwtService: JwtService,) {}

    extractUserFromJwt(jwt: string) {
        if (!jwt) return null
        jwt = jwt.split(' ')[1]
        const decode = this.jwtService.decode(jwt)
        return !decode ? null : decode['login']
    }

    async getMyNotificationsFriends(user_login: string) {
        try {
            const notifications = await this.prisma.notification.findMany({
                where: {
                    user_login: user_login,
                    OR: [
                        { type: 'FRIEND_REQUEST' },
                        { type: 'FRIEND_REQUEST_ACCEPTED' },
                    ],
                },
            })
            return notifications
        } catch (error) {
            console.log(error)
        }
    }

    async checkIfFriend(user: string, friend: string) {
        const friends = await this.friendService.getFriends(user)
        return friends.some(f => f.login === friend)
    }

    async deleteFriend(user: string, friend: string) {
        if (!(await this.friendService.DeleteFriend(friend, user)))
            return false
        if (!(await this.friendService.DeleteFriend(user, friend)))
            return false
        return true
    }
}