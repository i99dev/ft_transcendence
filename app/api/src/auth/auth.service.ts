import { User, UserStatus, PrismaClient } from '@prisma/client';
import axios, { AxiosRequestConfig } from 'axios';
import { Injectable } from "@nestjs/common";
const crypto = require('crypto');


@Injectable({})
export class AuthService {
	prisma = new PrismaClient();
	
	GetToken(name: any): string{
		let token: string = name.split(' ')[1];
		return token;
	}
	
	async getAccessToken(authCode) {
		const response = await axios.post('https://api.intra.42.fr/oauth/token', {
			grant_type: 'authorization_code',
			client_id: process.env.CLIENT_ID,
			client_secret: process.env.CLIENT_SECRET,
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

}
