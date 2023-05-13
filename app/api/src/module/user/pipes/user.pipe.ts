import { UserPatchDto } from './../dto/user.dto'
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
            wr: 0,
        }
        return vari
    }

    async transform(value: UserPatchDto) {
        const chatRoom = new UserPatchDto()
        Object.assign(chatRoom, this.createAssignValue())
        const userPatchKeys = Object.keys(chatRoom)
        const valueKeys = Object.keys(value)
        console.log(valueKeys)
        for (const key of valueKeys) {
            if (!userPatchKeys.includes(key)) {
                throw new BadRequestException(`Invalid field: ${key}`)
            }
            if (
                key === 'status' &&
                value[key] !== 'ONLINE' &&
                value[key] !== 'OFFLINE' &&
                value[key] !== 'INGAME' &&
                value[key] !== 'INQUEUE'
            ) {
                throw new BadRequestException(`Invalid type value`)
            }
        }

        // const errors = await validate(value)
        // if (errors.length > 0) {
        //     throw new BadRequestException('Validation failed')
        // }
        return value
    }
}
