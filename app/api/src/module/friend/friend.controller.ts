import { FriendService } from './friend.service'
import { UserGetDto } from './dto/friend.dto'
import {
    Get,
    Controller,
    Param,
    Patch,
    Delete,
} from '@nestjs/common'

@Controller('/friend')
export class FriendController {
    constructor(private readonly FriendService: FriendService) {}

    @Patch('/:name/:friend')
    async UpdateFriend(
        @Param('name') name: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        this.FriendService.CheckFriendsUpdate(name, friend)
        return await this.FriendService.getUser(name)
    }

    @Delete('/:name/:friend')
    async DeleteFriend(
        @Param('name') name: string,
        @Param('friend') friend: string,
    ): Promise<UserGetDto> {
        return await this.FriendService.DeleteFriend(friend, name)
    }

    @Get('/:name')
	async GetFriends(@Param('name') name: string): Promise<UserGetDto[]> {
			return await this.FriendService.getFriends(name)
	}
}
