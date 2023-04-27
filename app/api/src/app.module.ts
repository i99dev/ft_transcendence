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
import { NotificationModule } from '@module/notification/notification.module'
import { MailerModule } from '@nestjs-modules/mailer'
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
@Module({
    imports: [
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
        PrismaModule,
        GameModule,
        ChatModule,
        MatchHistoryModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
