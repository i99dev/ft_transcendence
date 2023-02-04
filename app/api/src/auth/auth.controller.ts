import { Controller, Get, Req, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AccessTokenDto } from "./dto/auth.dto";

@Controller('/api')
export class AuthController {

	constructor(private authService: AuthService) {}

	@Get('/auth')
	async GetAuth(@Req() request, @Res() res) {
		const { statusCode, access_token} = await this.authService.authenticate(request.headers.code);
		res.status(statusCode);
		res.send(access_token);
	}
}
