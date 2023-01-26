import { PrismaService } from './prisma/prisma.service';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { userController } from './user/user.controller';
import { userService } from './user/user.service';

@Module({
  imports: [],
  controllers: [AppController, userController],
  providers: [AppService, userService, PrismaService],
})
export class AppModule {}
