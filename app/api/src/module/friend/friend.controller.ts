import { FriendService } from './friend.service'
import { Get, Controller, Param, Post, Delete, BadRequestException } from '@nestjs/common'
import { JwtAuthGuard } from '../../common/guards/jwt.guard'
import { UseGuards, Req } from '@nestjs/common'
import { UserGetDto } from '@module/user/dto/user.dto'
import { ParseStringPipe } from '@common/pipes/string.pipe'
@UseGuards(JwtAuthGuard)
@Controller('/users/:user/friends')
export class FriendController {
    constructor(private readonly FriendService: FriendService) {}

    @Get('')
    async GetFriends(@Req() req): Promise<UserGetDto[]> {
        return await this.FriendService.getFriends(req.user.login)
    }

    @Post('/:friend')
    async UpdateFriend(
        @Param('user', ParseStringPipe) user: string,
        @Param('friend', ParseStringPipe) friend: string,
        @Req() req,
    ): Promise<UserGetDto> {
        if (user === friend) throw new BadRequestException('You cannot add yourself as a friend')
        if (user !== req.user.login)
            throw new BadRequestException('You cannot add a friend for someone else')
        const newFriend = await this.FriendService.CheckFriendsUpdate(user, friend)
        if (!newFriend) throw new BadRequestException('Friend not found')
        return newFriend
    }

    @Delete('/:friend')
    async DeleteFriend(
        @Param('user', ParseStringPipe) user: string,
        @Param('friend', ParseStringPipe) friend: string,
        @Req() req,
    ): Promise<UserGetDto> {
        if (user === friend) throw new BadRequestException('You cannot remove yourself as a friend')
        if (user !== req.user.login)
            throw new BadRequestException('You cannot remove a friend for someone else')
        const deletedFriend = await this.FriendService.DeleteFriend(friend, user)
        if (!deletedFriend) throw new BadRequestException('Friend not found')
        return deletedFriend
    }
}
