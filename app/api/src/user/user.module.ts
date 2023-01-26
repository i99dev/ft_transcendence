import { PrismaService } from './../prisma/prisma.service';
import { PrismaModule } from './../prisma/prisma.module';
import { userService } from './user.service';
import { userController } from './user.controller';
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [userController],
    providers: [userService],
})
export class UserModule {}