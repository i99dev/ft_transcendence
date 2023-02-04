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

	DecideSortType(type: string): Promise<any> {
		switch (type) {
			case 'id':
				return this.repository.sortUserBy();
			case 'wins':
				return this.repository.SortUserByWins();
			case 'xp':
				return this.repository.SortUserByXP();
			case 'loses':
				return this.repository.SortUserByLoses();
			case 'ladder':
				return this.repository.SortUserByWinGap();
			default:
				return this.repository.sortUserBy();
		}
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