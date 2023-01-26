import { Get } from '@nestjs/common';
import { userService } from './user.service';
import { Controller} from "@nestjs/common";
import { Param } from '@nestjs/common';

@Controller()
export class userController {
	constructor(private readonly userService: userService) {}

	@Get('/api/users')
	getUsers() {
		return this.userService.getAllUsers();
	}

	@Get('/api/users/:name')
	getSign(@Param('name') name: string) {
		return this.userService.getUser(name);
	}

	@Get('/api/users/:name/:info')
	getSignup(@Param('name') name:string, @Param('info') info:string) {
		return this.userService.getUserInfo(name, info);
	}
}
