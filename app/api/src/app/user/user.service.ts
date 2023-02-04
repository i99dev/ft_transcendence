import { PrismaClient, User } from '@prisma/client';
import { NewUser } from './interface/user.interface';
import { Injectable } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";

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

	async SortMany(orderBy: object){
		if ( orderBy == null ) 
			return await this.getAllUsers();
		const sortedUsers = await this.prisma.user.groupBy({
			by: ['id', 'login', 'first_name', 'last_name', 'image', 'email', 'total_wins', 'total_loses', 'exp_level', 'points', 'created_at', 'last_login', 'status'],
			orderBy: orderBy
		});
		return sortedUsers;
	}

}