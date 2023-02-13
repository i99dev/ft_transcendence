

import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { UserValidPatchDto } from '../dto/user.dto';

@Injectable()
export class UserPatchValidationPipe implements PipeTransform<any> {
  async transform(value: any) {
    const userPatch = new UserValidPatchDto();
    Object.assign(userPatch, value);
    const userPatchKeys = Object.keys(userPatch);
    const valueKeys = Object.keys(value);
    for (let i = 0; i < (valueKeys.length); i++) {
      const key = valueKeys[i];
      if (!isNaN(parseFloat(key))) {
        break;
      }
      if (!userPatchKeys.includes(key)) {
        throw new BadRequestException(`Invalid field: ${key}`);
      }
    }
    const errors = await validate(userPatch);
    if (errors.length > 0) {
      const message = errors.map(error => Object.values(error.constraints)).join(', ');
      throw new BadRequestException(message);
    }
    return value;
  }
  
}