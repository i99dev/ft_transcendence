import { isAscii } from 'class-validator'
import { BadGatewayException, Injectable, PipeTransform } from '@nestjs/common'
import { WsException } from '@nestjs/websockets'

@Injectable()
export class ParseSocketStringPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        let flag: boolean = false
        if (!value || value == '' || value.length > 255) flag = true
        if (flag) throw new WsException('Invalid string')
        return value
    }
}
