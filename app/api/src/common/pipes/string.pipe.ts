import { isAscii } from 'class-validator'
import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class ParseStringPipe implements PipeTransform<string, string> {
    transform(value: string): string {
        let flag: boolean = false
        if (
            !value ||
            value == undefined ||
            value == null ||
            value == '' ||
            value.length > 100 ||
            !isAscii(value)
        )
            flag = true
        if (flag) throw new Error('Invalid string')
        return value
    }
}
