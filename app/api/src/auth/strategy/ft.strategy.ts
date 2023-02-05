import { Strategy } from 'passport-strategy';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { userInfo } from 'os';

@Injectable()
export class FtStrategy extends PassportStrategy(Strategy, 'FtStrategy') {
  constructor(private authService: AuthService) {
    super();
  }

  async authenticate(req) {

    // If the code header value is not present, throw an UnauthorizedException

    if (!req || !req.headers || !req.headers.code) {
      throw new BadRequestException();
    }
    const code = req.headers.code;
    // Call the validate() method with the code header value and AuthService instance
    try {
      const user = await this.validate(code);
      this.success(user);
    } catch (error) {
      this.fail(error);
    }
  }

  async validate(code) {
    // Use the AuthService instance
    // ...
    const user = await this.authService.validateUser(code);
    
    // Perform any additional validation logic, such as checking the code against a database, etc.
    // ...

    // If the validation fails, throw an UnauthorizedException
    if (!user) {
      throw new UnauthorizedException();
    }

    // Return the user object if the validation succeeds
    return user;
  }
}