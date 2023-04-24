import { Module } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { DefaultGateway } from './default.gateway'
import { DefaultService } from './default.service'
import { SocketService } from './socket.service'

@Module({
    imports: [AuthModule],
    providers: [DefaultGateway, DefaultService, SocketService],
})
export class DefaultModule {}
