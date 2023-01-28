import { UserDto, UserPatchDto } from './dto/user.dto';
import { User, UserStatus } from '@prisma/client';
import { UserService } from './user.service';
import { Body, Get, Post, Controller, Param, Patch, Delete } from '@nestjs/common';
import { PrismaService } from './../prisma/prisma.service';


@Controller('/api/users')
export class UserController {
	constructor(private readonly UserService: UserService) {}

	@Get() // get all users
	GetUsers(): Promise<User[]> {
		return this.UserService.GetAllUsers();
	}

	@Get('/:name') // get all of the info of the passed login user
	GetUser(@Param('name') name: string): Promise<User> {
		return this.UserService.GetUser(name);
	}

	@Get('/:name/:info') // get specific info from a user
	GetInfo(@Param('name') name:string, @Param('info') info:string): Promise<User> {
		return this.UserService.GetUserInfo(name, info);
	}

	@Post('/post') // for testing purposes only
	CreateUser(@Body() data1: UserDto): Promise<User> {
		let data: User;
		data = {
			id: data1.id,
			username: data1.username,
			fullname: data1.fullname,
			avatar: data1.avatar,
			email: data1.email,
			createdAt: new Date(),
			lastLogin: new Date(),
			status: UserStatus.online,
		};
		console.log({data});
		return this.UserService.CreateUser(data);
	}

	@Patch('/patch/:name') // to be edited later
	async UpdateUser(@Param('name') name: string, @Body() data1: UserPatchDto) {
		const existingUser = await this.UserService.GetUser(name);
		const updatedUser = Object.assign({}, existingUser, data1);
		return await this.UserService.UpdateUser(updatedUser);
	}

	@Delete('/delete/:name') // for testing purposes only
	DeleteUser(@Param('name') name: string) {
		return this.UserService.DeleteUser(name);
	}

}
