import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { AuthPostDto } from '../dto/auth.dto';

@Injectable()
export class ValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const authCode = plainToClass(AuthPostDto, req.body);
    const errors = await validate(authCode);

    if (errors.length > 0)
      throw new BadRequestException('Invalid Authorization Code');

    next();
  }
}
