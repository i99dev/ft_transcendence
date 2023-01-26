import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class userService{
	constructor(private prisma: PrismaService) {}

	async getUser(name: string): Promise<User> {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { username: name }
		});
		return user;
	}

	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async getUserInfo(name: string, info: string): Promise<User> {
		return await this.getUser(name)[info];
	}
}