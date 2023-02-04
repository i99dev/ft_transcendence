import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { Injectable, HttpStatus } from "@nestjs/common";
import { config } from "../config/config";
import { intra } from "../common/constants/setting";
import { UserService } from "../app/user/user.service";
import { AuthRepository } from "./repository/auth.repositroy";
import { AccessTokenDto } from './dto/auth.dto';
import { IntraAccessToken, Me } from './interfaces/auth.interface';

@Injectable({})
export class AuthService {
	private prisma = new PrismaClient();
	private userService = new UserService();
	private authReopsitory = new AuthRepository();

	async getIntraAccessToken(authCode) : Promise<IntraAccessToken> {
		const response = await axios.post(intra.paths.token, {
			grant_type: intra.grant_type,
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: authCode,
			redirect_uri: config.auth.redirect_uri
		});
		const accessToken = response.data.access_token;
		return accessToken;
	}

	async getUserProfile(accessToken) : Promise<Me> {
		return (await axios.get(intra.paths.me, {
			headers: {Authorization: `Bearer ${accessToken}`}
		})).data;
	}

	async setUser(data, tok) : Promise<void> {
		await this.prisma.user.upsert({
			where: {login: data.login},
			create: this.userService.CreateUserObject(data),
			update: {},
		})
	}

	async authenticate(code) : Promise<{statusCode: number, access_token: AccessTokenDto}> {
		const intraToken = await this.getIntraAccessToken(code);
		const data = await this.getUserProfile(intraToken);

		let statusCode = await this.authReopsitory.userExists(data.login) ? HttpStatus.OK : HttpStatus.CREATED;
		let tok = this.authReopsitory.getJwt(data);

		await this.setUser(data, tok);
		const token = this.authReopsitory.getAccessToken(tok);

		return {statusCode: statusCode, access_token: token};
	}

}
