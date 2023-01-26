import { User } from '@prisma/client';
import { Get, Post } from '@nestjs/common';
import { userService } from './user.service';
import { Controller} from "@nestjs/common";
import { Param } from '@nestjs/common';
import { UserStatus } from '@prisma/client';

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
	getInfo(@Param('name') name:string, @Param('info') info:string): Promise<any> {
		return this.userService.getUserInfo(name, info);
	}

	@Post('/api/post')
	createUser() {
		let data: User;
		data = {
			id: 6,
			username: 'mal-guna',
			fullname: 'Moatasem Al-Gunaid',
			avatar: 'https://cdn.intra.42.fr/users/9dd4ce5214846a4cf919a6290e7db56c/bnaji.jpg',
			email: 'mal-guna@student.42abudhabi.ae',
			createdAt: new Date(),
			lastLogin: new Date(),
			status: UserStatus.online,
		};
		return this.userService.createUser(data);
	}

}
