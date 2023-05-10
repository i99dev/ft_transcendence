import { FriendModule } from '../friend/friend.module'
import { PrismaClient } from '@prisma/client'
import { UserRepository } from './repository/user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { PrismaModule } from '../../providers/prisma/prisma.module'

@Module({
    imports: [forwardRef(() => AuthModule), FriendModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, PrismaClient],
    exports: [UserService],
})
export class UserModule {}
