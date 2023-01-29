import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class UserService{
	constructor(private prisma: PrismaService) {}
	
	async GetAllUsers() {
		return await this.prisma.user.findMany();
	}

	async GetUser(name: string): Promise<User> {
		return await this.prisma.user.findUnique({ where: { login: name } });
	}

	async GetUserInfo(name: string, info: string): Promise<User> {
		return await (await this.GetUser(name))[info];
	}

	async CreateUser(data: User) {
		return await this.prisma.user.create({ data });
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
			by: ['id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: {
				id: 'asc'
			}
		});
		return sortedUsers;
	}

}