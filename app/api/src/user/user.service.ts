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
		return await this.prisma.user.findUnique({ where: { username: name } });
	}

	async GetUserInfo(name: string, info: string): Promise<User> {
		return await (await this.GetUser(name))[info];
	}

	async CreateUser(data: User) {
		return await this.prisma.user.create({ data });
	}

	async UpdateUser(data: User) {
		return await this.prisma.user.update({
			where: { username: data.username },
			data,
		});
	}

	async DeleteUser(name: string) {
		return await this.prisma.user.delete({ where: { username: name } });
	}

	async SortUserById() {
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['id', 'username', 'fullname', 'avatar', 'email', 'createdAt', 'lastLogin', 'status'],
			orderBy: {
				id: 'asc'
			}
		});
		return sortedUsers;
	}

}