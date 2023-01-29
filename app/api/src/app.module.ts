import { AuthController } from './auth/auth.controller';
import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, AuthController],
  providers: [AppService, UserService, PrismaService, AuthService],
})
export class AppModule {}
