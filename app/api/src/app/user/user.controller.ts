import { UserDto, UserPatchDto } from './dto/user.dto';
import { User, UserStatus } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Get, Post, Controller, Param, Patch, Delete } from '@nestjs/common';



@Controller('/api/users')
export class UserController {
	constructor(private readonly UserService: UserService) {}
	
	@Get() // get all users
	GetUsers(): Promise<User[]> {
		return this.UserService.GetAllUsers();
	}

	@Get('/me') // get the logged in user
	GetMe() {
	}

	@Get('/sorted') // get the users sorted by their id
	SortUser() {
		return this.UserService.SortUserById();
	}

	@Get('/sorted/wins') // get the users sorted by their wins
	SortUserWins() {
		return this.UserService.SortUserByWins();
	}

	@Get('/sorted/loses') // get the users sorted by their loses
	SortUserLoses() {
		return this.UserService.SortUserByLoses();
	}

	@Get('/sorted/ladder') // get the users sorted by their wins-loses
	SortUserLadder() {
		return this.UserService.SortUserByWinGap();
	}

	@Get('/sorted/xp') // get the users sorted by their XP
	SortUserXP() {
		return this.UserService.SortUserByXP();
	}
	
	@Get('/:name') // get all of the info of the passed login user
	GetUser(@Param('name') name: string): Promise<User> {
		return this.UserService.GetUser(name);
	}
	
	@Get('/:name/:info') // get specific info from a user
	GetInfo(@Param('name') name:string, @Param('info') info:string): Promise<User> {
		return this.UserService.GetUserInfo(name, info);
	}

	@Patch('/:name') // to be edited later
	async UpdateUser(@Param('name') name: string, @Body() data1: UserPatchDto) {
		const existingUser = await this.UserService.GetUser(name);
		const updatedUser = Object.assign({}, existingUser, data1);
		return await this.UserService.UpdateUser(updatedUser);
	}

	@Delete('/:name') // for testing purposes only
	DeleteUser(@Param('name') name: string) {
		return this.UserService.DeleteUser(name);
	}

}
