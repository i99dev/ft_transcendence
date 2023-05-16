import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class IntPipeCheck implements PipeTransform<number> {
    transform(value: number) {
        let flag: boolean = false
        if (value < -2147483648 || value > 2147483647) flag = true
        if (flag) throw new BadRequestException('Invalid number')
        return value
    }
}
