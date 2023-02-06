import { UserGetDto } from './../app/user/dto/user.dto';
import axios from 'axios';
import { Injectable, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { config } from '../config/config';
import {
  intraConstants,
  jwtHeaderConstants,
} from '../common/constants/setting';
import { AuthRepository } from './repository/auth.repositroy';
import { IntraAccessToken, Me } from './interfaces/intra.interface';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';


@Injectable({})
export class AuthService {
  constructor(private authRepository: AuthRepository, private jwtService: JwtService) {}

  async checkUserAccount(
    intraUser: Me,
  ): Promise<{ httpStatus: HttpStatus; user: UserGetDto }> {
    const myuser: UserGetDto = await this.authRepository.getUser(intraUser.login);
    if (!myuser) {
      return {
        httpStatus: HttpStatus.CREATED,
        user: await this.authRepository.setupUserAccount(intraUser),
      };
    }
    return { httpStatus: HttpStatus.OK, user: myuser };
  }

  async validateUserWithIntra(code: string): Promise<Me> {
    try {
      const intraToken: IntraAccessToken = await this.getIntraAccessToken(code);
      return await this.getUserProfile(intraToken);
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async getIntraAccessToken(authCode: string): Promise<IntraAccessToken> {
    const response: any = await axios.post(intraConstants.paths.token, {
      grant_type: intraConstants.grant_type,
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code: authCode,
      redirect_uri: config.auth.redirect_uri,
    });

    if (response.status != HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return response.data.access_token;
  }

  async getUserProfile(accessToken: IntraAccessToken): Promise<Me> {
    const response: any = await axios.get(intraConstants.paths.me, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status != HttpStatus.OK) {
      throw new UnauthorizedException();
    }

    return response.data;
  }

  async getJwt(user: UserGetDto): Promise<string> {
    const payload = {
      id: user.id,
      login: user.login,
    };
    return this.jwtService.sign(payload);
  }

  async validateUser(code: string): Promise<Me> {
    return await this.validateUserWithIntra(code);
  }
}
