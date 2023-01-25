import { AuthService } from './user.service';
import { Controller, Post } from "@nestjs/common";

@Controller()
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('signin')
	signin() {
		return 'test from signin';
	}

	@Post('signup')
	signup() {
		return 'test from signup';
	}
}
