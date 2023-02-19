import { UserPatchDto } from './../dto/user.dto';
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { UserValidPatchDto } from '../dto/user.dto'

@Injectable()
export class UserPatchValidationPipe implements PipeTransform<any> {

    createAssignValue(): UserPatchDto {
        const vari: UserPatchDto = {
            username: 'string',
            first_name: 'string',
            last_name: 'string',
            image: 'string',
            status: 'ONLINE',
            two_fac_auth: true,
            total_loses: 0,
            total_wins: 0,
        }
        return vari;
    }
    
    async transform(value: any) {
        const userPatch = new UserValidPatchDto()
        const vari = this.createAssignValue();
        Object.assign(userPatch, vari)
        const userPatchKeys = Object.keys(userPatch)
        const valueKeys = Object.keys(value)
        for (let i = 0; i < valueKeys.length; i++) {
            const key = valueKeys[i]
            if (!userPatchKeys.includes(key)) {
                throw new BadRequestException(`Invalid field: ${key}`)
            }
        }
        const errors = await validate(userPatch)
        if (errors.length > 0) {
            const message = errors.map(error => Object.values(error.constraints)).join(', ')
            throw new BadRequestException(message)
        }
        return value
    }
}
