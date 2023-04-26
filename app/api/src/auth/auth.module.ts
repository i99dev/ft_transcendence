import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { forwardRef, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { UserModule } from '../module/user/user.module'
import { FtStrategy } from './strategy/ft.strategy'
import { AuthRepository } from './repository/auth.repository'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategy/jwt.strategy'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ValidationMiddleware } from './middleware/validation.middleware'
import { HttpModule } from '@nestjs/axios'

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN') },
            }),
        }),
        HttpModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, FtStrategy, JwtStrategy, AuthRepository],
    exports: [JwtModule],
})
export class AuthModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidationMiddleware)
            .forRoutes({ path: '/auth', method: RequestMethod.POST })
    }
}
