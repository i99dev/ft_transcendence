import { User, UserStatus, PrismaClient } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { Injectable } from "@nestjs/common";
const crypto = require('crypto');
import { config } from "../config/config";
import { intra } from "../common/constants/setting";
import { UserService } from "../app/user/user.service";
import { AuthRepository } from "./repository/auth.repositroy";

@Injectable({})
export class AuthService {
	prisma = new PrismaClient();
	UserService = new UserService();
	AuthReopsitory = new AuthRepository();

	GetToken(name: any): string{
		let token: string = name.split(' ')[1];
		return token;
	}
	
	async getAccessToken(authCode) {
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
	
	async getProfile(accessToken) {
		const response = await axios.get(intra.paths.me, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const profile = response.data;
		return profile;
	}

	async GetUserInfo(data) {
		let check: User;
		if (check = (await this.prisma.user.findUnique({ where: { login: data.login } }))){
			return check;
		}
		const token = this.AuthReopsitory.getJwt(data);
		// const decoded = jwt.verify(token, config.jwt.secret);
		let id = this.UserService.generateUniqueId();
		const user = this.UserService.CreateUserObject(data, token, id);
		return await this.UserService.CreateUser(user);
	}

}
