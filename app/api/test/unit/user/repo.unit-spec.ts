import { Module } from '@nestjs/common'
import { UserRepository } from './../../../src/module/user/repository/user.repository'
import { FriendRepository } from '../../../src/module/friend/repository/friend.repository'
import { UserPatchDto } from './../../../src/module/user/dto/user.dto'
import { UserService } from './../../../src/module/user/user.service'
import { PrismaClient } from '@prisma/client'

describe('Check repo', () => {
    let appService: UserRepository
    let friendService: FriendRepository

    appService = new UserRepository(new PrismaClient())
    friendService = new FriendRepository()

    it('should get win difference', async () => {
        const user1: UserPatchDto = {
            total_wins: 5,
            total_loses: 5,
        }
        const user2: UserPatchDto = {
            total_wins: 5,
            total_loses: 5,
        }
        const response = appService.SortUserByWinLose(user1, user2)
        expect(response).toEqual(0)
    })

    it('should sort users', async () => {
        const response = await appService.SortUserByWinGap()
        expect(response).toBeTruthy()
    })

    it('should add friend', async () => {
        const response = await friendService.UpdateUserFriends('isaad', 'oal-tena')
        expect(response).toBeTruthy()
    })

    it('should delete friend', async () => {
        const response = await friendService.deleteFriend('isaad', 'oal-tena')
        expect(response).toBeTruthy()
    })
})
