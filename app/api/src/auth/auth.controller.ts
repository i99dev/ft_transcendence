import { Controller, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../app/user/user.service";

@Controller('/api')
export class AuthController {

	constructor(private authService: AuthService, private UserService: UserService) {}

	@Get('/auth')
	async GetAuth(@Req() request) {
		let token = this.authService.GetToken(request.headers.authorization);
		const auth = await this.authService.getAccessToken(token);
		const data = await this.authService.getProfile(auth);
		return (await this.UserService.GetUserInfo(data)).token;
	}
}
