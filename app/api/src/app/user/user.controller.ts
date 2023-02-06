import { User } from '@prisma/client';
import { UserGetDto, UserPatchDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Body, Get, Controller, Param, Patch, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';



@Controller('/api/users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get() // get all users
	async GetUsers(@Query('sort') sort: string, @Query('order') order: string) {
		let type = { [sort]: order };
		return await this.UserService.SortMany(type);
	}
	
	@UseGuards(JwtAuthGuard)
	@Get('/me') // get the logged in user
	async GetMe(@Req() req) {
		return await this.UserService.getUser(req.user.login); 
	}
	
	@Get('/:name') // get all of the info of the passed login user
	GetUser(@Param('name') name: string): Promise<UserGetDto> {
		return this.UserService.getUser(name);
	}

	@Patch('/:name') // to be edited later
	async UpdateUser(@Query('login') login: string, @Param('name') name: string, @Body() data1: UserPatchDto) {
		if (!login){
			const existingUser = await this.UserService.getUserForPatch(name);
			const updatedUser = Object.assign({}, existingUser, data1);
			return await this.UserService.updateUser(updatedUser);
		}
		else {
			return await this.UserService.UpdateUserFriends(name, login);
		}
	}

	@Get('/:name/friends') // to be edited later
	async GetFriends(@Param('name') name: string) {
		return await this.UserService.getFriends(name);
	}

	@Delete('/:name') // for testing purposes only
	DeleteUser(@Query('login') login: string, @Param('name') name: string) {
		if (!login)
			return this.UserService.deleteUser(name);
		else {
			return this.UserService.deleteFriend(name, login);
		}
	}

}
