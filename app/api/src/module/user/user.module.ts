import { FriendModule } from '../friend/friend.module'
import { UserRepository } from './repository/user.repository'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { forwardRef, Module } from '@nestjs/common'
import { AuthModule } from '../../auth/auth.module'
import { PrismaModule } from '../../providers/prisma/prisma.module'
import { PrismaService } from '@providers/prisma/prisma.service'

@Module({
    imports: [forwardRef(() => AuthModule), FriendModule, PrismaModule],
    controllers: [UserController],
    providers: [UserService, UserRepository, PrismaService],
    exports: [UserService, UserRepository],
})
export class UserModule {}
