import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './module/user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { FriendModule } from './module/friend/friend.module'
import config from './config/config'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config],
        }),
        AuthModule,
        UserModule,
        FriendModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
