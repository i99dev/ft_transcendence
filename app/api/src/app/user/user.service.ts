import { PrismaClient, User, UserStatus } from '@prisma/client';
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import * as jwt from 'jsonwebtoken';
const crypto = require('crypto');
import { v4 as uuidv4 } from 'uuid';

@Injectable({})
export class UserService{
	prisma = new PrismaClient();
	repository = new UserRepository();

	async getAllUsers() {
		return await this.prisma.user.findMany();
	}

	async getUser(name: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { login: name } });
	}

	async getUserInfo(name: string, info: string): Promise<User> {
		return await (await this.getUser(name))[info];
	}

	async updateUser(data: User) {
		return await this.prisma.user.update({
			where: { login: data.login },
			data,
		});
	}

	async deleteUser(name: string) {
		return await this.prisma.user.delete({ where: { login: name } });
	}

	async sortUserBy() {
		const sortedUsers = await this.repository.sortUserById();
		return sortedUsers;
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

	generateUniqueId = (): number => {
		const buf = crypto.randomBytes(4);
		return buf.readUInt32BE(0) % 2147483647;
	}
}