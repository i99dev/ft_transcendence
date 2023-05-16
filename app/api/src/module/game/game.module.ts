import { Module, forwardRef } from '@nestjs/common'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { DefaultModule } from './gateway/default.module'
import { gameAnalyzer } from './logic/gameAnalyzer'
import { gameHistory } from './logic/gameHistory'
import { PongGame } from './logic/pongGame'
import { GameRepository } from './repository/game.repository'

@Module({
    imports: [forwardRef(() => DefaultModule)],
    controllers: [GameController],
    providers: [GameService, gameAnalyzer, gameHistory, PongGame, GameRepository],
    exports: [GameService, gameAnalyzer, gameHistory, PongGame, GameRepository],
})
export class GameModule {}
