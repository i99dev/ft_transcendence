import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from 'axios';
// import { ExtractJwt } from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { User, UserStatus } from '@prisma/client';
import { randomInt } from 'crypto';
import * as base64url from 'base64url';
import { v4 as uuidv4 } from 'uuid';



@Injectable({})
export class AuthService {
	constructor(private prisma: PrismaService) {}

	GetToken(name: any): string{
		let token: string = name.split(' ')[1];
		return token;
	}

	async getAccessToken(authCode) {
		const response = await axios.post('https://api.intra.42.fr/oauth/token', {
			grant_type: 'authorization_code',
			client_id: process.env.client_id,
			client_secret: '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',
			code: authCode,
			redirect_uri: 'http://127.0.0.1/api'
		});
		const accessToken = response.data.access_token;
		return accessToken;
	}
	
	async getProfile(accessToken) {
		const response = await axios.get('https://api.intra.42.fr/v2/me', {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		const profile = response.data;
		return profile;
	}
	
	async GetUserInfo(data) {
		let data1: User;
		
		const key = jwt.sign(uuidv4(), process.env.secret);

		const decoded = jwt.verify(key, process.env.secret);

		console.log('token: --->>' + key);
		console.log('token: --->>' + decoded);
		data1 = {
			token: key,
			id: randomInt(1000),
			login: data.login,
			first_name: data.first_name,
			last_name: data.last_name,
			image: data.image.link,
			email: data.email,
			total_wins: 0,
			total_loses: 0,
			exp_level: 0,
			points: 0,
			two_fac_auth: false,
			created_at: new Date(),
			last_login: new Date(),
			status: UserStatus.ONLINE,
		};


		// console.log(data.login);
		// console.log(data.email);
		// console.log(data.first_name);
		// console.log(data.last_name);
		// console.log(data.image.link);
		return await this.CreateUser(data1);
		// return this.prisma.user.create({ data: data1 });
		// return this.prisma.user.findMany();
	}

	async CreateUser(data: User) {
		return await this.prisma.user.create({ data });
	}

}