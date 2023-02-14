import { FriendRepository } from './../../../src/module/friend/repository/friend.repository';
import { UserGetDto } from './../../../src/module/user/dto/user.dto'
import { UserService } from './../../../src/module/user/user.service'
import { FriendService } from './../../../src/module/friend/friend.service'
import { UserRepository } from './../../../src/module/user/repository/user.repository'
import { PrismaClient } from '@prisma/client'

describe('CheckFriendsUpdate', () => {
    let appService: UserService
    let friendService: FriendService

    appService = new UserService(new UserRepository(new PrismaClient()), new PrismaClient())
    friendService = new FriendService(new FriendRepository(new PrismaClient()), new PrismaClient())

    it('should update friends list', async () => {
        const name = 'isaad'
        const response = await friendService.CheckFriendsUpdate('oal-tena', name)
        expect(response).toBeFalsy()
    })

    it('should return common friends', async () => {
        const name = 'isaad'
        const response = await friendService.getFriends(name)
        expect(response).toBeTruthy()
    })

    it('should return sorted users', async () => {
        const orderBy: object = { total_wins: 'asc' }
        const response = await appService.SortMany(orderBy)
        expect(response).toBeTruthy()
    })

    it('should update one user', async () => {
        const user: UserGetDto = {
            id: 99,
            login: 'isaad',
            username: 'IS',
            status: 'LIVE',
            first_name: 'Imad',
            last_name: 'Saad',
            email: 'isaad@student.42abudhabi.ae',
            created_at: new Date(),
            last_login: new Date(),
            image: 'https://cdn.intra.42.fr/users/f63f7f3080ae66de20d2b71c03559aaf/isaad.jpg',
            total_wins: 9,
            total_loses: 1,
            exp_level: 0,
            points: 0,
            two_fac_auth: false,
        }
        const response = await appService.updateUser(user)
        expect(response).toBeTruthy()
    })

    it('should return one user', async () => {
        const user: string = 'isaad'
        const response = await appService.getUserForPatch(user)
        expect(response).toBeTruthy()
    })

    it('should return one user with friends', async () => {
        const user: string = 'isaad'
        const response = await appService.getUser(user)
        expect(response).toBeTruthy()
    })
})
