import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../app/user/user.module';
import { FtStrategy } from './strategy/ft.strategy';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';



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
				signOptions: { expiresIn: configService.getOrThrow('JWT_EXPIRES_IN')}
			}),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FtStrategy, JwtStrategy, AuthRepository],
})
export class AuthModule {}
