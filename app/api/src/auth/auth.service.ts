import { UserGetDto } from '../module/user/dto/user.dto';
import { Injectable, HttpStatus } from '@nestjs/common';
import { IntraAccessToken, Me } from './interfaces/intra.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../module/user/user.service';
import { AuthRepository } from './repository/auth.repository';

@Injectable({})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private authrepository: AuthRepository,
  ) {}

  async checkUserAccountOnDb(
    intraUser,
  ): Promise<{ httpStatus: HttpStatus; user: UserGetDto }> {
    const myuser: UserGetDto = await this.userService.getUser(intraUser.login);
    if (!myuser) {
      return {
        httpStatus: HttpStatus.CREATED,
        user: await this.userService.CreateUser(intraUser),
      };
    }
    return { httpStatus: HttpStatus.OK, user: myuser };
  }

  async validateUserWithIntra(code: string): Promise<Me> {
    const intraToken: IntraAccessToken =
      await this.authrepository.getIntraAccessToken(code);
    return await this.authrepository.getUserIntraProfile(intraToken);
  }

  async getJwt(user: UserGetDto): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
    };
    return this.jwtService.sign(payload);
  }
}
