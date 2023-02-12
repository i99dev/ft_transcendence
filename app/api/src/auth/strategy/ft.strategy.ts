import { Strategy } from 'passport-strategy';
import { PassportStrategy } from '@nestjs/passport';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Me } from '../interface/intra.interface';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'FtStrategy') {
  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req) {
    try {
      if (!req || !req.body || !req.body.code) {
        throw new BadRequestException();
      }

      const code: string = req.body.code;

      const user: Me = await this.validate(code);
      this.success(user);
    } catch (error) {
      this.fail(error);
    }
  }

  async validate(code): Promise<Me> {
    const user: Me = await this.authService.validateUserWithIntra(code);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
