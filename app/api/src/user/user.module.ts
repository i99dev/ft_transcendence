import { AuthService } from './user.service';
import { AuthController } from './user.controller';
import { Module } from "@nestjs/common";

@Module({
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}