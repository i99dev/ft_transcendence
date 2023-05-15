import { FriendService } from './friend.service'
import { Get, Controller, Param, Post, Delete } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { UseGuards, Req } from '@nestjs/common'
import { UserGetDto } from '@module/user/dto/user.dto'
@Controller('/users/:user/friends')
export class FriendController {
    constructor(private readonly FriendService: FriendService) {}

    @UseGuards(JwtAuthGuard)
    @Get('')
    async GetFriends(@Req() req): Promise<UserGetDto[]> {
        return await this.FriendService.getFriends(req.user.login)
    }

    @Post('/:friend')
    async UpdateFriend(
        @Param('user') user: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        return await this.FriendService.CheckFriendsUpdate(user, friend)
    }

    @Delete('/:friend')
    async DeleteFriend(
        @Param('user') user: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        return await this.FriendService.DeleteFriend(friend, user)
    }
}
