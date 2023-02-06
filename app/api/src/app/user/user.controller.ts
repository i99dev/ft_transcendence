import { User } from '@prisma/client';
import { UserGetDto, UserPatchDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Body, Get, Controller, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';



@Controller('/api/users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get()
	async GetUsers(@Query('sort') sort: string, @Query('order') order: string) {
		let type = { [sort]: order };
		return await this.UserService.SortMany(type);
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('/me')
	async GetMe(@Req() req) {
		return await this.UserService.getUser(req.user.login); 
	}
	
	@Get('/:name')
	GetUser(@Param('name') name: string): Promise<UserGetDto> {
		return this.UserService.getUser(name);
	}

	@Patch('/:name')
	async UpdateUser(@Param('name') name: string, @Body() data1: UserPatchDto) {
		if (data1.friends) {
			await this.UserService.UpdateUserFriends(name, data1.friends)
			delete data1.friends;
		}
		const existingUser = await this.UserService.getUserForPatch(name);
		const updatedUser = Object.assign({}, existingUser, data1);
		return await this.UserService.updateUser(updatedUser);
	}

	@Get('/:name/friends')
	async GetFriends(@Param('name') name: string) {
		return await this.UserService.getFriends(name);
	}

	@Delete('/:name')
	DeleteUser(@Body() login, @Param('name') name: string) {
		if (login.friends)
			return this.UserService.deleteFriend(name, login.friends);
		else {
			return this.UserService.deleteUser(name);
		}
	}

}
