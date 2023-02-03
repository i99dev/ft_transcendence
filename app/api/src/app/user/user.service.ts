import { PrismaClient, User, UserStatus } from '@prisma/client';
import { NewUser } from './interface/user.interface';
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import * as jwt from 'jsonwebtoken';
const crypto = require('crypto');
import { v4 as uuidv4 } from 'uuid';
import { config } from "../../config/config";

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
	
	CreateUserObject(data: any, token: any): NewUser {
    let user: NewUser = {
      login: data.login,
      username: data.login,
      first_name: data.first_name,
      last_name: data.last_name,
      image: data.image.link,
      email: data.email,
      token: token,
    }
    return user;
  }

	async CreateUser(data: any) {
		return await this.prisma.user.create({data});
	}

}