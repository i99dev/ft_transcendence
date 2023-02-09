import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class LoginValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value.login) {
      throw new BadRequestException('Login is required');
    }
    if (typeof value.login !== 'string') {
      throw new BadRequestException('Login must be a string');
    }
    if (!/^\S*$/.test(value.login)) {
      throw new BadRequestException('Login must not contain spaces');
    }
    if (value.login.length > 20) {
      throw new BadRequestException('Login must be no more than 20 characters');
    }
    return value;
  }
}
