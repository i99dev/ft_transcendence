import { PrismaClient } from '@prisma/client';
import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from 'axios';
import * as jwt from 'jsonwebtoken';
import { User, UserStatus } from '@prisma/client';
const crypto = require('crypto');
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
dotenv.config();



@Injectable({})
export class AuthService {
	prisma = new PrismaClient();

	generateUniqueId = (): number => {
		const buf = crypto.randomBytes(4);
		return buf.readUInt32BE(0) % 2147483647;
	}
	
	GetToken(name: any): string{
		let token: string = name.split(' ')[1];
		return token;
	}
	
	async getAccessToken(authCode) {
		const response = await axios.post('https://api.intra.42.fr/oauth/token', {
			grant_type: 'authorization_code',
			client_id: "u-s4t2ud-1e6576a63e91afd8227156e6675bc3d9f62d4ca49e17b887a27a2436dfd2b3e8",
			client_secret: "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",
			code: authCode,
			redirect_uri: 'http://localhost/api'
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
	
	CreateUserObject(data, key: string, id: number) {
		let user: User;
		user = {
			token: key,
			id: id,
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
		return user;
	}
	
	async CreateUser(data: User) {
		return await this.prisma.user.create({ data });
	}

	async GetUserInfo(data) {
		let check: User;
		if (check = (await this.prisma.user.findUnique({ where: { login: data.login } }))){
			// console.log('.env: --->>' + process.env.secret);
			return check;
		}
		const key = jwt.sign(uuidv4(), "process.env.secret");
		// const decoded = jwt.verify(key, process.env.secret);
		let id = this.generateUniqueId();
		// console.log('.env: --->>' + process.env.secret);
		const user = this.CreateUserObject(data, key, id);
		return await this.CreateUser(user);
	}

}
