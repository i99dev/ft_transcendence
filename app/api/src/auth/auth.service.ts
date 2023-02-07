import { UserGetDto } from './../app/user/dto/user.dto';
import axios from 'axios';
import { Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { config } from '../config/config';
import { intraConstants } from '../common/constants/setting';
import { IntraAccessToken, Me } from './interfaces/intra.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../app/user/user.service';

@Injectable({})
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
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
      return (
        await axios.post(intraConstants.paths.token, {
          grant_type: intraConstants.grant_type,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: authCode,
          redirect_uri: config.auth.redirect_uri,
        })
      ).data.access_token;
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization Code');
    }
  }

  async getUserIntraProfile(accessToken: IntraAccessToken): Promise<Me> {
    try {
      return (
        await axios.get(intraConstants.paths.me, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
      ).data;
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
