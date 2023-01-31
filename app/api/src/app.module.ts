import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { UserController } from './app/user/user.controller';
import { UserService } from './app/user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
