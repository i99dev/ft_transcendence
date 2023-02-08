import { UserGetDto } from './../app/user/dto/user.dto';
import axios from 'axios';
import { Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import {
  intraConstants,
} from '../common/constants/setting';
import { IntraAccessToken, Me } from './interfaces/intra.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../app/user/user.service';
import { ConfigService } from '@nestjs/config';


@Injectable({})
export class AuthService {
  constructor(private jwtService: JwtService,
              private userService: UserService,
              private configService: ConfigService,
              ) {}

  async checkUserAccountOnDb(
    intraUser: Me,
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
    const intraToken: IntraAccessToken = await this.getIntraAccessToken(code);
    return await this.getUserIntraProfile(intraToken);
  }

  async getIntraAccessToken(authCode: string): Promise<IntraAccessToken> {
    try {
      return (await axios.post(intraConstants.paths.token, {
        grant_type: intraConstants.grant_type,
        client_id: this.configService.getOrThrow<string>('auth.clientId'),
        client_secret: this.configService.getOrThrow<string>('auth.clientSecret'),
        code: authCode,
        redirect_uri: this.configService.getOrThrow<string>('auth.redirectUri'),
      })).data.access_token;
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization Code');
    }
  }

  async getUserIntraProfile(accessToken: IntraAccessToken): Promise<Me> {
    try {
      return (await axios.get(intraConstants.paths.me, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })).data;
    } catch (error) {
        throw new UnauthorizedException('Invalid Intra User');
    }
  }

  async getJwt(user: UserGetDto): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
    };
    return this.jwtService.sign(payload);
  }
}
