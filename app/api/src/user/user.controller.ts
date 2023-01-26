import { Get } from '@nestjs/common';
import { userService } from './user.service';
import { Controller} from "@nestjs/common";

@Controller()
export class userController {
	constructor(private readonly userService: userService) {}

	// @Post('signin')
	// signin() {
	// 	return 'test from signin';
	// }

	// @Post('signup')
	// signup() {
	// 	return 'test from signup';
	// }

	@Get('/api/signin')
	getSignin() {
		return this.userService.getSignin();
	}

	@Get('/api/signup')
	getSignup(): string {
		return this.userService.getSignup();
	}
}
