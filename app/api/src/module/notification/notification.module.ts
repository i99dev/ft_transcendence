import { PrismaService } from '@providers/prisma/prisma.service'
import { PrismaClient } from '@prisma/client'
import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaClient, PrismaService],
    exports: [NotificationService],
})
export class NotificationModule {}
