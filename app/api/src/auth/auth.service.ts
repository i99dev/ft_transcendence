import axios from 'axios';
const jwt = require('jsonwebtoken');
import { Injectable, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { config } from "../config/config";
import { intraConstants, jwtHeaderConstants } from "../common/constants/setting";
import { AuthRepository } from "./repository/auth.repositroy";
import { IntraAccessToken, Me } from './interfaces/auth.interface';
import { User } from '@prisma/client';

@Injectable({})
export class AuthService {
	private authRepository = new AuthRepository();

	async checkUserAccount(intraUser: Me) : Promise<{httpStatus: HttpStatus, user: User}> {

		const myuser: User = await this.authRepository.getUser(intraUser.login);
		if (!myuser) {
			return {httpStatus: HttpStatus.CREATED, user: await this.authRepository.setupUserAccount(intraUser)}
		}
		return {httpStatus: HttpStatus.OK, user: myuser};
	}

	async validateUserWithIntra(code: string): Promise<Me> {
		try {
			const intraToken: IntraAccessToken = await this.getIntraAccessToken(code);
			return await this.getUserProfile(intraToken);
		} catch (error) {
			throw new UnauthorizedException();
		}
  }

	async getIntraAccessToken(authCode: string) : Promise<IntraAccessToken> {
		
		const response: any = await axios.post(intraConstants.paths.token, {
			grant_type: intraConstants.grant_type,
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
			code: authCode,
			redirect_uri: config.auth.redirect_uri
		});

		if (response.status != HttpStatus.OK) {
			throw new UnauthorizedException();
		}

		return response.data.access_token;
	}

	async getUserProfile(accessToken: IntraAccessToken) : Promise<Me> {

		const response: any = await axios.get(intraConstants.paths.me, {
			headers: {Authorization: `Bearer ${accessToken}`}
		});

		if (response.status != HttpStatus.OK) {
			throw new UnauthorizedException();
		}
	
		return response.data;
	}

	async getJwt(user: User): Promise<string> {
    const header = jwtHeaderConstants;
    const payload = {
			id: user.id,
			login: user.login,
		};
    return jwt.sign(payload, config.jwt.secret, { header });
  }

	async validateUser(code: string) : Promise<Me> {
		return await this.validateUserWithIntra(code);
	}

}
