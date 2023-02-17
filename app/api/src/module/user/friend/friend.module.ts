import { PrismaClient } from '@prisma/client'
import { FriendService } from './friend.service'
import { FriendController } from './friend.controller'
import { Module } from '@nestjs/common'
import { FriendRepository } from './repository/friend.repository'

@Module({
    imports: [],
    controllers: [FriendController],
    providers: [FriendService, FriendRepository, PrismaClient],
})
export class FriendModule {}
