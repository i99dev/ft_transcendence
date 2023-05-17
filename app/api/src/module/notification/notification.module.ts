import { PrismaService } from '@providers/prisma/prisma.service'
import { Module } from '@nestjs/common'
import { NotificationController } from './notification.controller'
import { NotificationService } from './notification.service'

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationService, PrismaService, PrismaService],
    exports: [NotificationService],
})
export class NotificationModule {}
