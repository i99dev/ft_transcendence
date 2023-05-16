import { isAscii } from 'class-validator'
import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        let flag: boolean = false
        if (!value || value == '' || value.length > 255) flag = true
        if (flag) throw new Error('Invalid string')
        return value
    }
}
