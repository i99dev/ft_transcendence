import { HttpStatus } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../../app/user/user.service';
import { Me } from '../interfaces/auth.interface';

export class AuthRepository {
  constructor(private userService: UserService) {}

  async setupUserAccount(user: Me) : Promise<User> {
		return await this.userService.CreateUser(this.userService.CreateUserObject(user));
	}

  async userExists(login: string): Promise<boolean> {
		return await this.userService.getUser(login) ? true : false;
	}

  async getUser(login: string): Promise<User> {
		return await this.userService.getUser(login);
	}

}
