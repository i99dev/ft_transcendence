import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { FtGuard } from "../common/guards/auth.gaurd";
import { JwtAuthGuard } from "../common/guards/jwt.guard";
import { AuthService } from "./auth.service";
import { AccessTokenDto } from "./dto/auth.dto";

@Controller('/api')
export class AuthController {

	constructor(private authService: AuthService) {}

	@UseGuards(FtGuard)
	@Get('/auth')
	async GetAuth(@Req() req, @Res() res) : Promise<AccessTokenDto>{
		
		const {httpStatus, user} = await this.authService.checkUserAccount(req.user);
		const token: string = await this.authService.getJwt(user);

		return res.status(httpStatus).json(new AccessTokenDto(token));
	}
}
