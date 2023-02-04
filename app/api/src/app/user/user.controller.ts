import { UserGetDto, UserPatchDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Body, Get, Controller, Param, Patch, Delete, Query } from '@nestjs/common';



@Controller('/api/users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get() // get all users
	GetUsers(@Query('sort') sort: string): Promise<UserGetDto []> {
		if (!sort)
			return this.UserService.getAllUsers();
		else{
			return this.UserService.DecideSortType(sort);
		}
	}

	@Get('/me') // get the logged in user
	GetMe() {
	}
	
	@Get('/:name') // get all of the info of the passed login user
	GetUser(@Param('name') name: string): Promise<UserGetDto> {
		return this.UserService.getUser(name);
	}
	
	@Get('/:name/:info') // get specific info from a user
	GetInfo(@Param('name') name:string, @Param('info') info:string): Promise<UserGetDto> {
		return this.UserService.getUserInfo(name, info);
	}

	@Patch('/:name') // to be edited later
	async UpdateUser(@Param('name') name: string, @Body() data1: UserPatchDto) {
		const existingUser = await this.UserService.getUser(name);
		const updatedUser = Object.assign({}, existingUser, data1);
		return await this.UserService.updateUser(updatedUser);
	}

	@Delete('/:name') // for testing purposes only
	DeleteUser(@Param('name') name: string) {
		return this.UserService.deleteUser(name);
	}

}
