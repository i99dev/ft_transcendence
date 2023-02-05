import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from "@nestjs/common";
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../app/user/user.module';
import { FtStrategy } from './strategy/ft.strategy';
import { AuthRepository } from './repository/auth.repositroy';

@Module({
	imports: [PassportModule, UserModule],
	controllers: [AuthController],
	providers: [AuthService, FtStrategy, AuthRepository]
})
export class AuthModule {}
