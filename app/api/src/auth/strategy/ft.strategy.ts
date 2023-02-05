import { Strategy } from 'passport-strategy';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { userInfo } from 'os';
import { Me } from '../interfaces/auth.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'FtStrategy') {
  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req) {

    if (!req || !req.headers || !req.headers.code) {
      throw new BadRequestException();
    }
    const code: string = req.headers.code;

    try {
      const user: Me = await this.validate(code);
      this.success(user);
    } catch (error) {
      this.fail(error);
    }
  }

  async validate(code) : Promise<Me> {

    const user: Me = await this.authService.validateUser(code);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}