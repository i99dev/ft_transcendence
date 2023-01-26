import { PrismaService } from './../prisma/prisma.service';
import { PrismaClient, User } from '@prisma/client';
import { Injectable } from "@nestjs/common";

@Injectable({})
export class userService{
	constructor(private prisma: PrismaService) {}
	
	async getAllUsers(): Promise<User[]> {
		return await this.prisma.user.findMany();
	}

	async getUser(name: string): Promise<User> {
		return await this.prisma.user.findUniqueOrThrow({ where: { username: name } });
	}

	async getUserInfo(name: string, info: string): Promise<User> {
		return await this.getUser(name)[info];
	}

	async createUser(data: User) {
		return await this.prisma.user.create({ data });
	}

}