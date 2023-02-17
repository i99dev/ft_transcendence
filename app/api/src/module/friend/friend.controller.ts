import { FriendService } from './friend.service'
import { UserGetDto } from './dto/friend.dto'
import { Get, Controller, Param, Patch, Delete } from '@nestjs/common'

@Controller('/users')
export class FriendController {
    constructor(private readonly FriendService: FriendService) {}

    @Patch('/:user/friend/:friend')
    async UpdateFriend(
        @Param('user') user: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        return await this.FriendService.CheckFriendsUpdate(user, friend)
    }

    @Delete('/:user/friend/:friend')
    async DeleteFriend(
        @Param('user') user: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        return await this.FriendService.DeleteFriend(friend, user)
    }

    @Get('/:user/friend')
    async GetFriends(@Param('user') user: string): Promise<UserGetDto[]> {
        return await this.FriendService.getFriends(user)
    }
}
