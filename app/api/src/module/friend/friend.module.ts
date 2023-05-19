import { FriendService } from './friend.service'
import { FriendController } from './friend.controller'
import { Module, forwardRef } from '@nestjs/common'
import { PrismaService } from '@providers/prisma/prisma.service'
import { UserService } from '@module/user/user.service'
import { UserModule } from '@module/user/user.module'
import { PrismaModule } from '@providers/prisma/prisma.module'

@Module({
    imports: [forwardRef(() => UserModule), PrismaModule],
    controllers: [FriendController],
    providers: [FriendService],
    exports: [FriendService],
})
export class FriendModule {}
