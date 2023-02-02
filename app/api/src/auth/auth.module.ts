import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Module } from "@nestjs/common";
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [AuthService]
})
export class AuthModule {}
