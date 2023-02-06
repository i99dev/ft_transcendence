import { Controller, Post, Req, Res, UseGuards } from "@nestjs/common";
import { FtAuthGuard } from "../common/guards/ft_auth.gaurd";
import { AuthService } from "./auth.service";
import { AccessTokenDto } from "./dto/auth.dto";

@Controller('/api')
export class AuthController {

	constructor(private authService: AuthService) {}

	@UseGuards(FtAuthGuard)
	@Post('/auth')
	async GetAuth(@Req() req, @Res() res) : Promise<AccessTokenDto>{
		
		const {httpStatus, user} = await this.authService.checkUserAccount(req.user);
		const token: string = await this.authService.getJwt(user);

		return res.status(httpStatus).json(new AccessTokenDto(token));
	}
}
