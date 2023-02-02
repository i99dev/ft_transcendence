import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { UserController } from './app/user/user.controller';
import { UserService } from './app/user/user.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { FriendController } from './app/friend/friend.controller';
import { FriendService } from './app/friend/friend.service';

@Module({
  imports: [],
  controllers: [AppController, FriendController, UserController, AuthController],
  providers: [AppService, FriendService, UserService, AuthService],
})
export class AppModule {}
