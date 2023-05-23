import { Module, forwardRef } from '@nestjs/common'
import { GameController } from './game.controller'
import { GameService } from './game.service'
import { DefaultModule } from './gateway/default.module'

@Module({
    imports: [forwardRef(() => DefaultModule)],
    controllers: [GameController],
    providers: [GameService],
    exports: [GameService],
})
export class GameModule {}
