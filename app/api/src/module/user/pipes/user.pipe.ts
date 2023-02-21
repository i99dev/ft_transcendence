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
            total_loses: 0,
            total_wins: 0,
        }
        return vari
    }

    async transform(value: any) {
        const userPatch = new UserValidPatchDto()
        const vari = this.createAssignValue()
        Object.assign(userPatch, vari)
        const userPatchKeys = Object.keys(userPatch)
        const valueKeys = Object.keys(value)
    
        const validationPromises = valueKeys.map(async (key) => {
            if (!isNaN(parseFloat(key))) {
                return
            }
            if (!userPatchKeys.includes(key)) {
                throw new BadRequestException(`Invalid field: ${key}`)
            }
            const valueType = typeof value[key]
            const expectedType = typeof vari[key]
            if (valueType !== expectedType) {
                throw new BadRequestException(
                    `Invalid type for field ${key}: expected ${expectedType}, but got ${valueType}`,
                )
            }
            if ((typeof value[key] === 'number' && value[key] > 2147483647) || value[key] < 0) {
                throw new BadRequestException(`The value of ${key} is out of range`)
            }
            return
        })
    
        await Promise.all(validationPromises)
    
        const errors = await validate(Object.assign(userPatch, value))
        if (errors.length > 0) {
            const message = errors.map(error => Object.values(error.constraints)).join(', ')
            throw new BadRequestException(message)
        }
        return value
    }
    
}
