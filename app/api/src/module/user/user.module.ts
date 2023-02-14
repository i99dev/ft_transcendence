import { PrismaClient } from '@prisma/client';
import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'

@Module({
    imports: [forwardRef(() => AuthModule)],
    controllers: [UserController],
    providers: [UserService, UserRepository, PrismaClient],
    exports: [UserService],
})
export class UserModule {}
