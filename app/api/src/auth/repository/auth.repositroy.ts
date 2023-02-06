import { UserGetDto } from './../../app/user/dto/user.dto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from '../../app/user/user.service';
import { Me } from '../interfaces/intra.interface';

@Injectable()
export class AuthRepository {
  private userService = new UserService();

  async setupUserAccount(user: Me): Promise<UserGetDto> {
    return await this.userService.CreateUser(
      this.userService.CreateUserObject(user),
    );
  }

  async userExists(login: string): Promise<boolean> {
    return (await this.userService.getUser(login)) ? true : false;
  }

  async getUser(login: string): Promise<UserGetDto> {
    return await this.userService.getUser(login);
  }
}
