

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { UserPatchDto } from '../dto/user.dto';

@Injectable()
export class UserPatchValidationPipe implements PipeTransform<any> {
  async transform(value: any) {
    const userPatch = new UserPatchDto();
    Object.assign(userPatch, value);
    const errors = await validate(userPatch);
    if (errors.length > 0) {
      const message = errors.map(error => Object.values(error.constraints)).join(', ');
      throw new BadRequestException(message);
    }
    return value;
  }
}