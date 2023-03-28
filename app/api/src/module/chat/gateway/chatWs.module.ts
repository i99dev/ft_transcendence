import { Module } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { ChatWsGateway } from './chatWs.gateway'
import { ChatWsService } from './chatWs.service'

@Module({
    imports: [AuthModule],
    providers: [ChatWsGateway, ChatWsService],
})
export class ChatWsModule {}
