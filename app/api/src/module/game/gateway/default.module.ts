import { Module } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { DefaultGateway } from './default.gateway'
import { DefaultService } from './default.service'

@Module({
    imports: [AuthModule],
    providers: [DefaultGateway, DefaultService],
})
export class DefaultModule { }
