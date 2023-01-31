import { PrismaService } from './../prisma/prisma.service';
import { PrismaModule } from './../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}