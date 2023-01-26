import { User } from '@prisma/client';
import { Get } from '@nestjs/common';
import { userService } from './user.service';
import { Controller} from "@nestjs/common";
import { Param } from '@nestjs/common';

@Controller()
export class userController {
	constructor(private readonly userService: userService) {}

	@Get('/api/users')
	getUsers(): Promise<User[]> {
		return this.userService.getAllUsers();
	}

	@Get('/api/users/:name')
	getUser(@Param('name') name: string): Promise<User> {
		return this.userService.getUser(name);
	}

	@Get('/api/users/:name/:info')
	getSignup(@Param('name') name:string, @Param('info') info:string): Promise<User> {
		return this.userService.getUserInfo(name, info);
	}
}
