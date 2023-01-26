import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class userService{
	constructor(private prisma: PrismaService) {}

	async getUser(name: string) {
		const user = await this.prisma.user.findUniqueOrThrow({
			where: { username: name }
		});
		return user;
	}

	async getAllUsers() {
		return await this.prisma.user.findMany();
	}

	async getUserInfo(name: string, info: string) {
		return await this.getUser(name)[info];
	}
}