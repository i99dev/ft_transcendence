import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../modules/user/user.module';
import { FtStrategy } from './strategy/ft.strategy';
import { AuthRepository } from './repository/auth.repository';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config/config';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, FtStrategy, JwtStrategy, AuthRepository],
})
export class AuthModule {}
