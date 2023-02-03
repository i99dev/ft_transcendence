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
		const users = await this.prisma.user.findMany();
		for (let i = 0; i < users.length; i++) {
			delete users[i].token;
		}
		return users;
	}

	async getUser(name: string): Promise<User> {
		const user = await this.prisma.user.findUnique({ where: { login: name } });
		delete user.token;
		return user;
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
		const sortedUsers = await this.repository.SortMany({
			id: 'asc'
		});
		return sortedUsers;
	}

	async SortUserByWins() {
		const sortedUsers = await this.repository.SortMany({
				total_wins: 'desc'
		});
		return sortedUsers;
	}

	async SortUserByXP() {
		const sortedUsers = await this.repository.SortMany({
			exp_level: 'desc'
		});
		return sortedUsers;
	}

	async SortUserByLoses() {
		const sortedUsers = await this.repository.SortMany({
			total_loses: 'desc'
		});
		return sortedUsers;
	}

	SortUserByWinLose(a, b) {
		const winLoseA = a.total_wins - a.total_loses;
		const winLoseB = b.total_wins - b.total_loses;
		return winLoseB - winLoseA;
	}	

	async SortUserByWinGap() {
		const users = await this.prisma.user.findMany();
		const sortedUsers = users.sort(this.SortUserByWinLose);
		for (let i = 0; i < sortedUsers.length; i++) {
			delete sortedUsers[i].token;
		}
		return sortedUsers;
	}

}