import { UserService } from './user.service';
import { UserController } from './user.controller';
import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from '../../auth/auth.module';

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}