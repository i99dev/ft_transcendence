import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { DefaultGateway } from './default.gateway'
import { DefaultService } from './default.service'
import { SocketService } from './socket.service'
import { GameModule } from '../game.module'
import { BlockModule } from '@module/block/block.module'

@Module({
    imports: [AuthModule, forwardRef(() => GameModule), BlockModule],
    providers: [DefaultGateway, DefaultService, SocketService, Array],
})
export class DefaultModule {}
