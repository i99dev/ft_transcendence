import { Controller, Get, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import axios, { AxiosRequestConfig } from 'axios';

@Controller('/api')
export class AuthController {

	constructor(private authService: AuthService) {}

	@Get('/auth')
	GetAuth(@Req() request): any {
		const token = this.authService.GetToken(request.headers.authorization);
		const config: AxiosRequestConfig = {
			headers: {
				Authorization: `Bearer 8b2cbe19da9ff8acdc4589f3e9505dbd8652f8a08ece2b99d39e5e0c5e2d237d`
			}
		};
		
		return axios.get('https://api.intra.42.fr/v2/me', config);
	}
}