import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        let payload
        try {
            payload = JSON.parse(value)
        } catch (error) {
            throw new WsException('Invalid Json format')
        }
        if (!metatype || !this.toValidate(metatype)) {
            return payload
        }
        const object = plainToInstance(metatype, payload)
        const errors = await validate(object)
        if (errors.length > 0) {
            throw new WsException('Validation failed')
        }
        return payload
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object]
        return !types.includes(metatype)
    }
}
