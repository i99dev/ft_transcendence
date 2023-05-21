import { Module, forwardRef } from '@nestjs/common'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { GameWsModule } from './gateway/GameWs.module'
import { gameAnalyzer } from './logic/gameAnalyzer'
import { gameHistory } from './logic/gameHistory'
import { PongGame } from './logic/pongGame'
import { GameRepository } from './repository/game.repository'
import { PrismaService } from '@providers/prisma/prisma.service'

@Module({
    imports: [forwardRef(() => GameWsModule)],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule { }
