import { PrismaClient, User } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class UserService{
	prisma = new PrismaClient();
	async GetAllUsers() {
		return await this.prisma.user.findMany();
	}

	async GetUser(name: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { login: name } });
	}

	async GetUserInfo(name: string, info: string): Promise<User> {
		return await (await this.GetUser(name))[info];
	}

	async UpdateUser(data: User) {
		return await this.prisma.user.update({
			where: { login: data.login },
			data,
		});
	}

	async DeleteUser(name: string) {
		return await this.prisma.user.delete({ where: { login: name } });
	}

	async SortUserById() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['token', 'id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				id: 'asc'
			}
		});
		return sortedUsers;
	}

	async SortUserByWins() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['token', 'id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				total_wins: 'desc'
			}
		});
		return sortedUsers;
	}

	async SortUserByXP() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['token', 'id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				exp_level: 'desc'
			}
		});
		return sortedUsers;
	}

	async SortUserByLoses() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['token', 'id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				total_loses: 'desc'
			}
		});
		return sortedUsers;
	}

	SortUserByWinLose(a, b) {
		const winLoseA = a.total_wins - a.total_loses;
		const winLoseB = b.total_wins - b.total_loses;
		return winLoseB - winLoseA;
	}	

	async SortUserByWinGap() {
		const sortedUsers = await this.prisma.user.findMany();
		return sortedUsers.sort(this.SortUserByWinLose);
	}

}