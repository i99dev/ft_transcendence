import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './module/user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import config from './config/config'
import { PrismaModule } from './providers/prisma/prisma.module'
import { GameModule } from './module/game/game.module'
import { MatchHistoryModule } from './module/match-history/match-history.module'
import { MulterModule } from './module/multer/multer.module'
@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
        }),
        AuthModule,
        UserModule,
        PrismaModule,
        GameModule,
        MatchHistoryModule,
        MulterModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
