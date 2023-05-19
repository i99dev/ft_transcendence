import { ChatModule } from './module/chat/chat.module'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './module/user/user.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config from './config/config'
import { PrismaModule } from './providers/prisma/prisma.module'
import { GameModule } from './module/game/game.module'
import { MatchHistoryModule } from './module/match-history/match-history.module'
import { AchievementModule } from './module/achievement/achievement.module'
import { LeaderboardModule } from './module/leaderboard/leaderboard.module'
import { MulterModule } from './module/multer/multer.module'
import { NotificationModule } from '@module/notification/notification.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { FriendWsModule } from '@module/friend/gateway/friendWs.module'
import { BlockModule } from '@module/block/block.module'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { FriendModule } from '@module/friend/friend.module'

@Module({
    imports: [
        PrismaModule,
        ThrottlerModule.forRoot({
            ttl: 60,
            limit: 20,
        }),
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                transport: {
                    service: 'gmail',
                    auth: {
                        user: configService.getOrThrow<string>('email.user'),
                        pass: configService.getOrThrow<string>('email.password'),
                    },
                },
                defaults: {
                    from: '"nest-modules" <modules@nestjs.com>',
                },
                preview: true,
                template: {
                    dir: __dirname + '/../templates',
                    adapter: new PugAdapter(),
                    options: {
                        html: true,
                        strict: true,
                    },
                },
            }),
        }),
        ConfigModule.forRoot({
            load: [config],
        }),
        AuthModule,
        UserModule,
        FriendWsModule,
        GameModule,
        ChatModule,
        MatchHistoryModule,
        AchievementModule,
        LeaderboardModule,
        MulterModule,
        NotificationModule,
        BlockModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule {}
