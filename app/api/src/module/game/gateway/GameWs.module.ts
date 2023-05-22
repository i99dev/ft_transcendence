import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../../auth/auth.module'
import { DefaultGateway } from './GameWs.gateway'
import { GameWsService } from './GameWs.service'
import { SocketService } from './socket.service'
import { GameModule } from '../game.module'
import { BlockModule } from '@module/block/block.module'

@Module({
    imports: [AuthModule, forwardRef(() => GameModule), BlockModule],
    providers: [DefaultGateway, GameWsService, SocketService, Array],
})
export class GameWsModule { }
