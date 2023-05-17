import { FriendService } from './friend.service'
import { FriendController } from './friend.controller'
import { Module, forwardRef } from '@nestjs/common'
import { FriendRepository } from './repository/friend.repository'
import { PrismaService } from '@providers/prisma/prisma.service'
import { UserService } from '@module/user/user.service'
import { UserModule } from '@module/user/user.module'

@Module({
    imports: [forwardRef(() => UserModule)],
    controllers: [FriendController],
    providers: [FriendService, FriendRepository, PrismaService],
    exports: [FriendService, FriendRepository],
})
export class FriendModule {}
